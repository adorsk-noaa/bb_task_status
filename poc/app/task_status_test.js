require([
  "jquery",
  "use!backbone",
  "use!underscore",
  "_s",
  "use!ui",
  "TaskStatus"
],

function($, Backbone, _, _s, ui, TaskStatus){

    var stages = new Backbone.Collection();
    var num_stages = 5;
    for (var i = 1; i < num_stages + 1 ; i++){
        var stage = new Backbone.Model({
            id: i,
            label: 'Stage ' + i
        });
        stages.add(stage);
    }

    tracker_model = new Backbone.Model({
        stages: stages
    });

    tracker_view = new TaskStatus.views.TaskStatusTrackerView({
        el: $('#main'),
        model: tracker_model
    });

    var fakeStageCounter = 1;
    var getFakeStatus = function(){
        var task_status = {};
        var i = fakeStageCounter % num_stages;

        if (i == 0){
            task_status.code = 'complete';
            task_status.msg = 'Task Complete!';
        }
        else{
            task_status.code = 'running';
            task_status.msg = 'running...';
        }

        var fake_stages = {};
        _.each(stages.models, function(stageModel){
            stage_id = parseInt(stageModel.id);
            if (stage_id < i){
                fake_stages[stage_id] = {
                    status: {
                        code: 'complete',
                        msg: 'completed!'
                    }
                };
            }
            else if (stage_id == i){
                fake_stages[stage_id] = {
                    status: {
                        code: 'running',
                        msg: 'running...'
                    }
                };
            }
        });

        var data = {
            status: task_status,
            stages: fake_stages
        };

        fakeStageCounter++;

        return data;
    };
    window.gfs = getFakeStatus;

    var doFakeTaskRequest = function(opts){
        var deferred = $.Deferred();
        opts = opts || {};
        opts.delay = opts.delay || 500;
        setTimeout(function(){
            deferred.resolve(getFakeStatus());
        }, opts.delay);
        return deferred;
    };

    window.dftr = doFakeTaskRequest;

    var onReceiveTaskData = function(data){
        console.log("received task data: ", data);
        if (data.status.code == 'complete'){
            console.log('complete');
        }
        else{
            var deferred = doFakeTaskRequest();
            deferred.done(onReceiveTaskData);
        }
    };

    var taskDeferred = doFakeTaskRequest();
    taskDeferred.done(onReceiveTaskData);

	$(document).ready(function(){
        console.log('yo');
	});
});
