define([
	"jquery",
	"use!backbone",
	"use!underscore",
	"_s",
	"use!ui",
	"./Stage",
	"text!./templates/TaskStatusTracker.html"
		],
function($, Backbone, _, _s, ui, StageView, template){

	var TaskStatusTrackerView = Backbone.View.extend({
        events: {},

		initialize: function(){
            $(this.el).addClass('task-status-tracker');
            this.stages = this.model.get('stages');
            this.initialRender();
		},

        initialRender: function(){
            var html = _.template(template, {model: this.model});
            $(this.el).html(html);

            this.$stages = $('.stages', this.el);
            _.each(this.stages.models, function(stageModel){
                this.renderStage(stageModel);
            }, this);
        },

        renderStage: function(stageModel){
            var stageView = new StageView({
                model: stageModel
            });
            this.$stages.append(stageView.el);
        },

	});

	return TaskStatusTrackerView;
});
		
