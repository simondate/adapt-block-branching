define([
  'coreJS/adapt',
  'coreModels/articleModel'
], function(Adapt, ArticleModel) {
  var ScenarioBranchingArticleModel = {


    _setup: function() {
      console.log('setup');
      console.log(this)
      if(this.get('_type') === "menu") return;
      console.log(this.get('_scenario'))
      if(!this.get('_scenario') || !this.get('_scenario')._isEnabled) return;
      this.listenToOnce(Adapt, 'pageView:postRender', this.startListener);
    },

    startListener: function() {
      this.listenTo(Adapt, {
        'router:page': this._checkResetAssessmentsOnRevisit
      });
    },

    _checkResetAssessmentsOnRevisit: function() {
      console.log(this)
      var allModels = this.getAllDescendantModels();
      _.each(allModels, function(model){
        model.set('_isResetOnRevisit', true);
      })
    }

  }
  return ScenarioBranchingArticleModel;
});
