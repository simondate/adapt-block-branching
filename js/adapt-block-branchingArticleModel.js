define([
  'coreJS/adapt',
  'coreModels/articleModel'
], function(Adapt, ArticleModel) {
  var ScenarioBranchingArticleModel = {


    _setup: function() {
      if(this.get('_type') === "menu") return;
      if(!this.get('_scenario') || !this.get('_scenario')._isEnabled) return;
      this.listenTo(Adapt, "remove", this.onRemove);
      if(!this.get('_scenario')._resetOnRevisit) return;
      this.listenToOnce(Adapt, 'pageView:postRender', this.startListener);
    },

    startListener: function() {
      this.listenTo(Adapt, {
        'router:page': this._resetArticle
      });
    },

    showBlocks: function() {
      _.each(this.findDescendantModels('blocks'), function(block) {
          block.set('_isHidden', false);
          block.set('_isAvailable', true);
      });
      Adapt.trigger("pageLevelProgress:update");
    },

    _resetArticle: function() {
      var allModels = this.getAllDescendantModels();
      _.each(allModels, function(model){
        model.set('_isResetOnRevisit', true);
      })
      Adapt.trigger("pageLevelProgress:update");
    },

    onRemove: function() {
      this.showBlocks();
    },

  }
  return ScenarioBranchingArticleModel;
});
