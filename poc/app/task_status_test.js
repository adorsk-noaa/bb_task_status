require([
  "jquery",
  "use!backbone",
  "use!underscore",
  "_s",
  "use!ui",
  "TaskStatus"
],

function($, Backbone, _, _s, ui, TaskStatus){

    randomString = function(n) {
        var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
        var string_length = n;
        var randomstring = '';
        for (var i=0; i<string_length; i++) {
            var rnum = Math.floor(Math.random() * chars.length);
            randomstring += chars.substring(rnum,rnum+1);
        }
        return randomstring;
    };

    var stages = new Backbone.Collection();
    var num_stages = 5;
    for (var i = 1; i < num_stages + 1 ; i++){
        label = randomString(Math.floor(Math.random() * 50));
        var stage = new Backbone.Model({
            id: i,
            label: _s.sprintf('Stage %s (%s)', i, label)
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

    var fakeStageCounter = 0;
    var first = true;
    var getFakeStatus = function(){
        var task_status = {};
        var i = (fakeStageCounter % num_stages);

        var fake_stages = {};
        if (i == 0 && ! first){
            fake_stages[num_stages] = {
                status: {
                    code: 'resolved',
                    msg: 'completed!'
                }
            };

            task_status.code = 'resolved';
            task_status.msg = 'Task Complete!';
        }
        else{
            first = false;
            _.each(stages.models, function(stageModel){
                stage_id = parseInt(stageModel.id);
                if (stage_id < (i+1)){
                    fake_stages[stage_id] = {
                        status: {
                            code: 'resolved',
                            msg: 'completed!'
                        }
                    };
                }
                else if (stage_id == (i+1)){
                    fake_stages[stage_id] = {
                        status: {
                            code: 'running',
                            msg: 'running...'
                        }
                    };
                }
            });

            task_status.code = 'running';
            task_status.msg = 'running...';
        }

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

    var updateTrackerModel = function(data){
        tracker_model.get('status').set(data.status);
        var tracker_stages = tracker_model.get('stages');
        _.each(data.stages, function(stage_data, stage_id){
            stageModel = tracker_stages.get(
                stage_id
            );

            if (! stageModel){
                tracker_stages.add(new Backbone.Model(stage_data));
            }
            else{
                stageModel.get('status').set(stage_data.status);
            }
        });
    };
    window.utm = updateTrackerModel;

    var onReceiveTaskData = function(data){
        console.log("received task data: ", data);

        updateTrackerModel(data);

        if (data.status.code == 'resolved'){
            console.log('resolved');
        }
        else{
            var deferred = doFakeTaskRequest({
                delay: 200 + Math.floor(Math.random() * 1000)
            });
            deferred.done(onReceiveTaskData);
        }
    };

    var taskDeferred = doFakeTaskRequest();
    taskDeferred.done(onReceiveTaskData);

	$(document).ready(function(){
        console.log('yo');
	});
});
