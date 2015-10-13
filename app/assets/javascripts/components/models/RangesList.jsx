define(['react', 'mui', 'allMixins',
    'js/components/models/RangeForm',
    'js/components/ArrayDataFillForm',
], function(React, mui, allMixins, RangeForm, ArrayDataFillForm) {

    const {Paper} = mui;

    return React.createClass({
        mixins: [
            allMixins.IntlMixin,
            allMixins.AjaxMixin,
        ],
        getDefaultProps() {
            return {
                msgKeyPrefix: 'controlPanel.models.ranges'
            };
        },
        getInitialState() {
            return {
                ranges: [],
            };
        },
        render() {
            return (
                <div>
                    <h4>{this.getMsg('labels.ranges')}</h4>
                    <ArrayDataFillForm
                        data={this.state.ranges}
                        fieldNames={['name']}
                        itemForm={RangeForm}
                        onItemSubmited={this.onItemSubmited}
                        performDelete={this.performRangeDelete}
                        fieldToStringMapper={this.modelRangeFieldToStringMapper}
                        msgKeyPrefix="controlPanel.models.ranges"/>
                </div>
            );
        },
        componentWillMount() {
            this.loadRanges();
        },
        loadRanges() {
            this.ajax(jsRoutes.controllers.Models.listRanges(), {
                success: (ranges) => this.setState({ranges: ranges})
            });
        },
        onItemSubmited() {
            this.loadRanges();
        },
        performRangeDelete(range) {
            this.ajax(jsRoutes.controllers.Models.deleteRange(range.id), {
                success: () => this.loadRanges()
            });
        },
        modelRangeFieldToStringMapper(key, value) {
            return this.getPreferedText(value);
        }
    });
});
