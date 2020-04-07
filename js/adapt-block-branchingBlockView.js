define([
  'coreJS/adapt',
  'coreViews/articleView'
], function(Adapt, CoreArticleView) {
  var ScenarioBranchingView = {
    notUsed: [],

    postRender: function() {
      //console.log("SimpleBranchingView"+":"+this.model.get("_id"), "postRender");
      CoreArticleView.prototype.postRender.call(this);

      this.listenTo(this.model, {
        "change:_isVisible": this.seeMe
      });

      console.log(this.model.isBranchingEnabled())

      if (this.model.isBranchingEnabled()) {
        this.hideFutureBlocks();
        if (this.model.isQuestionComplete()) {

          this.showBlocks();
        } else {
          console.log('listening')
          this.listenTo(this.model.getQuestionModel(), "change:_isInteractionComplete", this.onQuestionComplete);
        }
      }
    },

    seeMe:function() {
      this.hideFutureBlocks();
    },

    findBlockByScenarioId: function(scenarioId) {
      var ancestorModels = this.model.getAncestorModels();
      var page = ancestorModels[2];
      return _.find(page.findDescendantModels('blocks'), function(block) {
        console.log(block.get('_scenario')._scenarioId, scenarioId)
        console.log(parseInt(scenarioId, 10))
        if (block.get('_scenario')._scenarioId === parseInt(scenarioId, 10)) return true;
      });
    },



    hideBlocks: function() {
      var blockModelScenario = this.model.get('_scenario'),
        ans = blockModelScenario._userAnswer;
      for (key in ans) {
        var blockModel = Adapt.findBlockByScenarioId(ans[key]);
        blockModel.set("_isAvailable", false);
        blockModel.set("_isHidden", true);

        Adapt.trigger("pageLevelProgress:update");
      }
    },

    revealBlock: function(answerNum) {
      var block = this.findBlockByScenarioId(this.model.get('_scenario')._userAnswer[answerNum]);
      block.set('_isHidden', false);
      block.set('_isAvailable', true);
      Adapt.trigger("pageLevelProgress:update");
    },

    hideFutureBlocks: function() {
      var ancestorModels = this.model.getAncestorModels();
      var currentBlockNthChild = ancestorModels[0].get('_nthChild');
      var page = ancestorModels[2];
      _.each(page.findDescendantModels('blocks'), function(block) {
        block.set('_isLocked', false)
        if (block.get('_nthChild') > currentBlockNthChild + 1) {
          block.set('_isHidden', true);
          block.set('_isAvailable', false);
        }
      });
      Adapt.trigger("pageLevelProgress:update");
    },

    onQuestionComplete: function(model) {
      var answer = _.indexOf(model.get('_userAnswer'), true);
      var blockModel = model.getParent();
      this.revealBlock(answer);
    }
  };

  return ScenarioBranchingView;
});
