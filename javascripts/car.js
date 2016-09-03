/**
 * Created by rajendr on 02/09/16.
 */

define([], function() {
        function Car(road, position) {
               this.id = window.__next_id++;
                this.road = road;
              this.position = position;
               this.direction = 1;
           };

          return Car;
    });