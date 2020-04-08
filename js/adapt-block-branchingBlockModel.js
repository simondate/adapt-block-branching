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
                console.error("BranchingBlockModel", "Missing question" , id);
                return false;
            }

            if (question.get('_items').length != this.get('_scenario')._userAnswer.length) {
              console.error("BranchingBlockModel", "Number of questions doesn't equal branching");
              return false;
            }

            return true;
        },

        isQuestionComplete: function () {
            var questionModel = this.getQuestionModel();
            return questionModel ? questionModel.get("_isComplete") : false;
        },

        getChosenAnswer: function () {
            var questionModel = this.getQuestionModel();
            return _.find(questionModel, function(index) {
                if(questionModel.get('_modelAnswer')[index] === true) return true;
            });

        },
        /**
         * Returns Question model
         */
        getQuestionModel: function () {
            return this.getQuestion();
        }
    }
    return ScenarioBranchingModel;
});
