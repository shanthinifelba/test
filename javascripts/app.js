/**
 * Created by rajendr on 02/09/16.
 */
define(["jquery", "visualizer", "world"], function($, Visualizer, World) {
        function App() {
               this.FPS = 30;
           }

        App.prototype.init = function() {
                    this.world = new World();
                    this.world.load();
                    this.visualizer = new Visualizer(this.world);
                    setInterval(this.visualizer.draw.bind(this.visualizer), 1000 / this.FPS);
                    setInterval(this.world.onTick.bind(this.world), 1000 / this.FPS);
                };

            return App;
    });