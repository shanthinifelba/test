/**
 * Created by rajendr on 02/09/16.
 */
define(["jquery", "road", "junction", "utils"], function($, Road, Junction, utils) {
        function Visualizer(world) {
          //  this.THICKNESS = 15;
            this.world = world;
            this.canvas = $("#canvas")[0];
            this.ctx = this.canvas.getContext("2d");
            this.width = this.canvas.width;
            this.height = this.canvas.height;
            this.mouseDownPos = null;
            this.tempLine = null;
            this.tempJunction = null;
            this.dragJunction = null;
            this.gridStep = 20;
            this.mousePos = null;
            this.colors = {
                           background: "#fdfefe",
                           redLight: "#f1433f",
                           greenLight: "a9cf54",
                           junction: "#644",
                           draggedJunction: "blue",
                           road: "#776",
                           car: "#333",
                           hoveredJunction: "3d4c53",
                           tempLine: "#a4a",
                           grid: "#70b7ba",
                           hoveredGrid: "#f4e8e1",
                           unfinishedJunction: "#eee",
                       };
            var self = this;

            $(this.canvas).mousedown(function (e) {
                var point = self.getPoint(e);
                self.mouseDownPos = point;
                var hoveredJunction = self.getHoveredJunction(point);
                if (e.shiftKey) {
                    var rect = self.getBoundGridRect(self.mouseDownPos,self.mousePos);
                    self.tempJunction = new Junction(rect);
                }
                else if (e.altKey) {
                    self.dragJunction = hoveredJunction;
                }
                else if (hoveredJunction) {
                    self.tempLine = utils.line(hoveredJunction,point);
                }

            });
            $(this.canvas).mouseup(function(e) {
                var point = self.getPoint(e);
                //self.mouseDown = false;
                if (self.tempLine) {
                    var hoveredJunction = self.getHoveredJunction(point);
                    if (hoveredJunction) {
                        //making roads bidirectional by assigning road 1 and road 2 as opposites of each other
                        var road1 = new Road(self.tempLine.source, hoveredJunction);
                        self.world.addRoad(road1);
                        var road2 = new Road(hoveredJunction,self.tempLine.source);
                        self.world.addRoad(road2);
                    }
                    self.tempLine = null;
                }

                if (self.tempJunction){
                   self.world.addJunction(self.tempJunction);
                    self.tempJunction = null;
                }
                self.mouseDownPos = null;
                self.dragJunction = null;

            });


            $(this.canvas).mousemove(function(e) {
                            var point = self.getPoint(e);
                            var hoveredJunction = self.getHoveredJunction(point);
                            self.mousePos = point;
                            self.world.junctions.each(function (index,junction) {
                                junction.color = null;
                            });
                            if (hoveredJunction) {
                                hoveredJunction.color = self.colors.hoveredJunction;
                                }
                            if (self.tempLine) {

                            self.tempLine.target = point;
                                        }

                            if (self.dragJunction) {
                                var gridPoint = self.getClosestGridPoint(point);
                                self.dragJunction.rect.left = gridPoint.x;
                                self.dragJunction.rect.top = gridPoint.y;
                            }
                            if(self.tempJunction){
                                self.tempJunction.rect = self.getBoundGridRect(self.mouseDownPos,self.mousePos);
                            }

                        });

                    this.canvas.addEventListener("mouseout", function(e) {
                            self.mouseDownPos = null;
                            self.tempLine = null;
                            self.dragJunction = null;
                            self.mousePos = null;
                            self.tempJunction = null;
                        });

            }
        Visualizer.prototype.getPoint = function (e) {
            return {
                x:e.pageX - this.canvas.offsetLeft,
                y:e.pageY - this.canvas.offsetTop,
            };
        };

        Visualizer.prototype.drawJunction = function(junction, forcedcolor) {
               this.ctx.beginPath();
            var color = this.colors.junction;
                if(forcedcolor){
                    color = forcedcolor;
                }
                else if(junction.color) {
                    color = junction.color;
               // }else if(junction.state == Junction.prototype.STATE.RED){
                //    color = this.colors.redLight;
               // } else if(junction.state == Junction.prototype.STATE.GREEN){
               //     color = this.colors.greenLight;
                }
                this.ctx.fillStyle = color;
            //draw plus in junction
                var rect = junction.rect;
                this.ctx.beginPath();
                this.ctx.fillStyle = color;
                this.ctx.fillRect(rect.left,rect.top,rect.width,rect.height);

                var cx = rect.left + rect.width /2, cy = rect.top + rect.height/2;
                this.ctx.beginPath();
                this.ctx.strokeStyle = this.colors.background;
                this.ctx.moveTo(cx - this.gridStep / 3, cy);
                this.ctx.lineTo(cx + this.gridStep / 3, cy);
                this.ctx.stroke();
                this.ctx.beginPath();
                this.ctx.strokeStyle = thid.colors.background;
                this.ctx.moveTo(cx, cy - this.gridStep / 3);
                this.ctx.lineTo(cx ,cy+ this.gridStep / 3;
                this.ctx.stroke();
            };

        Visualizer.prototype.drawLine = function(point1, point2, color) {

                var offset = 0;
                // FIX ME: dirty hack, should be replaced with a graph - drawing library
                len = utils.getDistance(point1,point2);
                dx = 2*(point2.x - point1.x )/len;
                dy = 2*(point2.y - point1.y )/len;
                this.ctx.beginPath();
                this.ctx.strokeStyle = color;
                this.ctx.moveTo(point1.x - dy, point1.y + dx);
                this.ctx.lineTo(point2.x - dy, point2.y + dx);
                this.ctx.stroke();
            };

        Visualizer.prototype.getCarPositionOnRoad = function(roadId, position) {
                var road = this.world.getRoad(roadId);
                var source = road.getSource(), target = road.getTarget();
                var dx = target.x - source.x,
                        dy = target.y - source.y;
                len = utils.getDistance(source,target);
                off_x = 2 *(target.x - source.x)/len;
                off_y = 2 *(target.y - source.y)/len;
                off_x = off_y = 0;

                return {
                        x: source.x + position * dx + off_y,
                            y: source.y + position * dy + off_x,
                    };
            };

        Visualizer.prototype.drawCar = function(car) {
                var point = this.getCarPositionOnRoad(car.road, car.position);
                this.ctx.beginPath();
                this.ctx.fillStyle = this.colors.car;
                this.ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
                this.ctx.fill();
            };

        Visualizer.prototype.drawBackground = function() {
            this.ctx.fillStyle = this.colors.background;
            this.ctx.fillRect(0, 0, this.width, this.height);
        };

        Visualizer.prototype.drawGrid = function () {
            this.ctx.fillStyle = this.colors.grid;
            for(var i = 0; i <= this.width; i+= gridStep) {
                for (var j = 0; j <= this.height; j += this.gridStep) {
                    this.ctx.fillRect(i-1, j-1, 2, 2);
                }
            }
        };

        Visualizer.prototype.getClosestGridPoint = function (point) {
            var result = {
                x: Math.round(point.x / this.gridStep) * this.gridStep,
                y: Math.round(point.y / this.gridStep) * this.gridStep,
            };
            console.log(point.x + " " + point.y + ":" + result.x + " " + result.y);
            return result;
        };

        Visualizer.prototype.drawHighlightedCell = function () {
            if(this.mousePos){
                this.ctx.fillStyle = this.colors.hoveredGrid;
                var topLeftCorner = this.getClosestGridPoint(this.mousePos);
                this.ctx.fillRect(topLeftCorner.x, topLeftCorner.y, this.gridStep, this.gridStep);

            };
        };

        Visualizer.prototype.getBoundGridRect = function (point1, point1) {

            var gridPoint1 = this.getClosestGridPoint(point1);
            var gridPoint2 = this.getClosestGridPoint(point2);

            var x1 = gridPoint1.x, var
            y1 = gridPoint1.y,
            var x2 = gridPoint2.x, var
            y2 = gridPoint2.y;
            if (x1 > x2) {
                x1 = x2 + (x2 = x1, 0);
            }
            if (y1 > y2) {
                y1 = y2 + (y2 = y1, 0);
            }
            x2 += this.gridStep;
            y2 += this.gridStep;
            return {left: x1, top: y1, width: x2 - x1, height: y2 - y1};

        };

        Visualizer.prototype.drawTempJunction = function () {

            var rect = this.getBoundGridRect(this.mouseDownPos,this.mousePos);
            this.ctx.fillStyle = this.colors.unfinishedJunction;
            this.ctx.fillRect(rect.left,rect.top,rect.width,rect.height);


        };

        Visualizer.prototype.getHoveredJunction = function (point) {

            for( var junction_id in this.world.junctions.all()){
                var junction = this.world.junctions.get(junction_id);
                var rect = junction.rect;
                if(rect.left <= point.x && point.x < rect.left + rect.width && rect.top <= point.y && point.y < rect.top + rect.height){
                    return junction;
                }
            }

        };

        Visualizer.prototype.draw = function () {
            this.drawBackground();
            this.drawGrid();
            this.drawHighlightedCell();

            var self = this;
            this.world.roads.each(function (index,road) {

                var source = self.world.getJunction(road.source),
                    target = self.world.getJunction(road.target);
                self.drawLine(source, target, self.colors.road);
            });
            this.world.junctions.each(function(index, junction) {
                self.drawJunction(junction);
            });
            this.world.cars.each(function(index, car) {
                self.drawCar(car);
            });
            if (self.tempLine) {
                self.drawLine(self.tempLine.source, self.tempLine.target, self.colors.tempLine);
            }
            if(self.tempJunction){
                self.drawJunction(self.tempJunction,self.colors.unfinishedJunction);
            }
        };

            return Visualizer;
    });