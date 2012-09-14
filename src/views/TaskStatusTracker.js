define([
	"jquery",
	"use!backbone",
	"use!underscore",
	"_s",
	"use!ui",
	"text!./templates/TaskStatusTracker.html"
		],
function($, Backbone, _, _s, ui, template){

	var TaskStatusTrackerView = Backbone.View.extend({
        events: {},

		initialize: function(){
            this.initialRender();
		},

        initialRender: function(){
            var html = _.template(template, {model: this.model});
            $(this.el).html(html);
        },

	});

	return TaskStatusTrackerView;
});
		
