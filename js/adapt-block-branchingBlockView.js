define([
  'coreJS/adapt',
  'coreViews/articleView'
], function(Adapt, CoreArticleView) {
  var ScenarioBranchingView = {

    postRender: function() {
      CoreArticleView.prototype.postRender.call(this);

      if(!this.model.get('_scenario')._isEnabled) return;

      if (this.model.isBranchingEnabled()) {
        if (this.model.isQuestionComplete()) {
          this.onQuestionComplete(this.model.getQuestionModel());
        } else {
          this.hideFutureBlocks();
          this.listenTo(this.model.getQuestionModel(), "change:_isInteractionComplete", this.onQuestionComplete);
        }
      }
    },

    findBlockByScenarioId: function(scenarioId) {
      var ancestorModels = this.model.getAncestorModels();
      var page = ancestorModels[2];
      return _.find(page.findDescendantModels('blocks'), function(block) {
        if (block.get('_scenario')._scenarioId == parseInt(scenarioId, 10)) return true;
      });
    },

    revealBlock: function(answerNum) {
      var block = this.findBlockByScenarioId(this.model.get('_scenario')._userAnswer[answerNum]);
      block.set('_isHidden', false);
      block.set('_isAvailable', true);
      block.set('_isLocked', false);
      Adapt.trigger("pageLevelProgress:update");
    },

    hideFutureBlocks: function() {
      var ancestorModels = this.model.getAncestorModels();
      var currentBlockNthChild = this.model.get('_nthChild');
      var page = ancestorModels[2];
      _.each(page.findDescendantModels('blocks'), function(block) {
        if (block.get('_nthChild') > currentBlockNthChild) {
          block.set('_isHidden', true);
          block.set('_isAvailable', false);
          block.set('_isLocked', true);
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
