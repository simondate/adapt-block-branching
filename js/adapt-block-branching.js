define([
    'coreJS/adapt',
    'coreViews/blockView',
    'coreModels/blockModel',
    'coreModels/articleModel',
    './adapt-block-branchingBlockView',
    './adapt-block-branchingBlockModel',
    './adapt-block-branchingArticleModel',
], function (Adapt, CoreBlockView, CoreBlockModel, CoreArticleModel, BlockView, BlockModel, ArticleModel) {

    var BRANCHING_ID = "_scenario";

    var BlockViewInitialize = CoreBlockView.prototype.initialize;
    CoreBlockView.prototype.initialize = function (options) {
        if (this.model.get(BRANCHING_ID) && this.model.get(BRANCHING_ID)._isEnabled) {
            //extend
            _.extend(this, BlockView);
        }
        //initialize the block in the normal manner
        return BlockViewInitialize.apply(this, arguments);
    };

    var BlockModelInitialize = CoreBlockModel.prototype.initialize;
    CoreBlockModel.prototype.initialize = function (options) {
        if (this.get(BRANCHING_ID) && this.get(BRANCHING_ID)._isEnabled) {
            //extend
            _.extend(this, BlockModel);
        }
        return BlockModelInitialize.apply(this, arguments);
    };

    var ArticleModelInitialize = CoreArticleModel.prototype.initialize;
    CoreArticleModel.prototype.initialize = function (options) {
        _.extend(this, ArticleModel);
        this._setup();

        return ArticleModelInitialize.apply(this, arguments);

    };

});
