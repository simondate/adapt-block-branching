define([
    'coreJS/adapt',
    'coreModels/blockModel'
], function (Adapt, CoreBlockModel) {
    var ScenarioBranchingModel = {

        setupModel: function () {
          CoreBlockModel.prototype.setupModel.call(this);
        },

        setCompletionStatus: function () {
            this.set({
                "_isComplete": true,
                "_isInteractionComplete": true,
            });
        },

        // //PUBLIC
        isBranchingEnabled: function () {
            var o = this.get("_scenario");
            if (o && o._isEnabled && this.isConfigValid()) return true;
            return false;
        },

        getConfig: function () {
            return this.get("_scenario");
        },

        getQuestion: function() {
          var components = this.get('_children').models;
          var question = _.find(components, function(component){
            return component.get('_isQuestionType');
          })
          if(question === undefined) return -1;
          return question;
        },
        // /**
        //  * Checks if the config object passed from JSON is valid
        //  */
        isConfigValid: function () {
            var config = this.getConfig(),
                id = this.get("_id");
            //
            var question = this.getQuestion();

            if (question === -1) {
                console.error("BranchingBlockModel", "Missing question");
                return false;
            }

            if (question.get('_items').length != this.get('_scenario')._userAnswer.length) {
              console.log(parseInt(question.get('_items').length, 10))
              console.log(parseInt(this.get('_scenario')._userAnswer.length, 10))
              console.error("BranchingBlockModel", "Number of questions doesn't equal branching");
              return false;
            }

            return true;
        },


        isQuestionComplete: function () {
            var questionModel = this.getQuestionModel();

            return questionModel ? questionModel.get("_isComplete") : false;
        },
        isQuestionCorrect: function () {
            var questionModel = this.getQuestionModel();

            return questionModel ? questionModel.get("_isCorrect") : false;
        },
        isQuestionAnswer: function () {
            var questionModel = this.getQuestionModel();
            var answer = questionModel.get("_userAnswer");
            return answer.indexOf(true);
        },
        isQuestionNotAnswer: function () {
            var questionModel = this.getQuestionModel(),
                answer = questionModel.get("_userAnswer"),
                notAnswer = [];
            for (var i = 0, len = answer.length; i < len; i++) {
                if(!answer[i]) notAnswer.push(i);
            }
        return notAnswer;
        },
        /**
         * Returns Question model
         */
        getQuestionModel: function () {

            var config = this.getConfig();

            return this.getQuestion();
        },

        // /**
        //  * An array of models associated with correct answer
        //  */
        getAnswerModel: function (ans) {
          var config = this.getConfig(),
          ids = config._userAnswer[ans];
            if (config._userAnswer.length < 1) return;
            return this._getModels(ids);
        },

        // //PRIVATE
        _checkUserAnswerModel: function (ids, id) {
            return this._checkModel(ids, id, "_userAnswer");
        },
        _checkCorrectModel: function (ids, id) {
            return this._checkModel(ids, id, "correct");
        },
        _checkIncorrectModel: function (ids, id) {
            return this._checkModel(ids, id, "incorrect");
        },
        _checkModel: function (ids, id, type) {
            //console.info("BranchingBlockModel", "_checkModel", arguments);
            var model;

                if (ids.indexOf(",") == -1) {

                    model = this._getModel(ids);
                    //
                    // if (!model) {
                    //     console.error("BranchingBlockModel", "There is no block mentioned in '" + type + "' ('" + ids + "') for block '" + id + "'.");
                    //     return false;
                    // }

                } else {
                    var listIds = ids.split(",");
                    var result = false,
                        i = 0;
                    while (listIds.length > 0) {
                        var li = listIds.pop();
                            result = this._checkModel(li, id, type);
                        if (!result) break;
                    }

                    return result;
                }
                return true;

        },

        _getModels: function (ids) {
            if (ids.indexOf(",") == -1) {
                var model = this._getModel(ids);
                if (model) return [model];
            }else {
                var listIds = ids.split(","),
                    i = 0,
                    result = [];

                while (listIds.length > 0) {
                    var id = listIds.pop();
                    var model = this._getModel(id);

                    if (!model) {
                        return;
                    } else {
                        result.push(model);
                    }
                }
                return result;
            }
            return;
        },
        _getModel: function (id) {
            try {
                var model = Adapt.findById(id);
            } catch (e) {}

            return model;
        }
    }
    return ScenarioBranchingModel;
});
