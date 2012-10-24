define([
	"jquery",
	"backbone",
	"underscore",
	"_s",
	"ui",
	"text!./templates/Stage.html"
		],
function($, Backbone, _, _s, ui, template){

	var StageView = Backbone.View.extend({
        events: {},

		initialize: function(){
            $(this.el).addClass('task-status-stage');

            // Initialize submodels.
            _.each(['status'], function(attr){
                if (! this.model.get(attr)){
                    this.model.set(attr, new Backbone.Model({
                        code: 'pending'
                    }));
                }
            }, this);
            this.status = this.model.get('status');

            this.initialRender();

            this.status.on('change', this.renderStatus, this);
		},

        initialRender: function(){
            var html = _.template(template, {model: this.model});
            $(this.el).html(html);
            this.renderStatus();
        },

        renderStatus: function(){
            $(this.el).removeClass('pending running resolved rejected');
            $(this.el).addClass(this.status.get('code'));
        }

	});

	return StageView;
});
		
