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

            // @TODO: Should this go in model definitions?
            _.each(['status'], function(attr){
                if (! this.model.get(attr)){
                    this.model.set(attr, new Backbone.Model());
                }
            }, this);

            _.each(['stages'], function(attr){
                if (! this.model.get(attr)){
                    this.model.set(attr, new Backbone.Collection());
                }
            }, this);

            this.stages = this.model.get('stages');
            this.status = this.model.get('status');
            this.initialRender();

            this.status.on('change', this.renderStatus, this);
		},

        initialRender: function(){
            var html = _.template(template, {model: this.model});
            $(this.el).html(html);

            this.$status = $('.status', this.el);

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

        renderStatus: function(){
            this.$status.html(JSON.stringify(this.status.toJSON()));
        }

	});

	return TaskStatusTrackerView;
});
		
