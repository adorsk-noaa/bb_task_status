require([
  "jquery",
  "use!backbone",
  "use!underscore",
  "_s",
  "use!ui",
  "TaskStatus"
],

function($, Backbone, _, _s, ui, TaskStatus){

    tracker_model = new Backbone.Model();
    tracker_view = new TaskStatus.views.TaskStatusTrackerView({
        el: $('#main'),
        model: tracker_model
    });

	$(document).ready(function(){
        console.log('yo');
	});
});
