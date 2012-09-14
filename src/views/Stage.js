define([
	"jquery",
	"use!backbone",
	"use!underscore",
	"_s",
	"use!ui",
	"text!./templates/Stage.html"
		],
function($, Backbone, _, _s, ui, template){

	var StageView = Backbone.View.extend({
        events: {},

		initialize: function(){
            $(this.el).addClass('task-status-stage');
            this.initialRender();
		},

        initialRender: function(){
            var html = _.template(template, {model: this.model});
            $(this.el).html(html);
        },

	});

	return StageView;
});
		
