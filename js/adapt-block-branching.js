define([
    'coreJS/adapt',
    'coreViews/blockView',
    'coreModels/blockModel',
    'coreModels/contentObjectModel',
    './adapt-block-branchingBlockView',
    './adapt-block-branchingBlockModel',
    './adapt-block-branchingPageModel',
], function (Adapt, CoreBlockView, CoreBlockModel, CorePageModel, BlockView, BlockModel, PageModel) {

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

    var PageModelInitialize = CorePageModel.prototype.initialize;
    CorePageModel.prototype.initialize = function (options) {
        console.log('reset on revisit')
        _.extend(this, PageModel);
        this._setup();

        return PageModelInitialize.apply(this, arguments);

    };

});
