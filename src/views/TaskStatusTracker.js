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

		initialize: function(opts){
            this.opts = opts;
            if (! this.opts.hasOwnProperty('progressBar')){
                this.opts.progressBar = true;
            }

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

            if (this.opts.progressBar){
                this.$progressBar = $('.progress-bar', this.el);
                this.$progressBar.progressbar({value: 1});
            }

            this.$status = $('.status', this.el);

            this.$stages = $('.stages', this.el);
            _.each(this.stages.models, function(stageModel){
                this.renderStage(stageModel);
            }, this);

            this.renderStatus();

        },

        renderStage: function(stageModel){
            var $stageRow = $('<div class="stage-row row"></div>');
            this.$stages.append($stageRow);
            var stageView = new StageView({
                model: stageModel,
                el: $stageRow
            });
        },

        renderStatus: function(){
            var status_code = this.status.get('code');
            $(this.el).removeClass('pending running resolved rejected');
            $(this.el).addClass(status_code);
            if (status_code == 'resolved'){
                this.$status.html(this.status.get('msg'));
            }
            else if (status_code == 'rejected'){
                this.$status.html(this.status.get('msg'));
            }

            if (this.opts.progressBar){
                this.$progressBar.progressbar(
                    'value', 
                    Math.max(1, this.status.get('progress') || 0)
                );
            }
        }

	});

	return TaskStatusTrackerView;
});
		
