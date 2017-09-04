import React from 'react';

const Case = React.createClass({
    propTypes: {
        on: React.PropTypes.any.isRequired,
        children: React.PropTypes.oneOfType([
            React.PropTypes.arrayOf(React.PropTypes.element),
            React.PropTypes.element,
        ]).isRequired,
    },
    render() {
        return <div>{this.props.children}</div>;
    }
});

const Default = React.createClass({
    propTypes: {
        children: React.PropTypes.oneOfType([
            React.PropTypes.arrayOf(React.PropTypes.element),
            React.PropTypes.element,
        ]).isRequired,
    },
    render() {
        return <div>{this.props.children}</div>;
    }
});

const Switch = React.createClass({
    propTypes: {
        of: React.PropTypes.any.isRequired,
        children: React.PropTypes.arrayOf(React.PropTypes.element).isRequired,
    },
    render() {
        return getBranch(this.props.children, this.props.of);
    },
});

export default {
    Switch: Switch,
    Case: Case,
    Default: Default,
};

function findCaseElement(elements, onValue) {
    return elements.filter((e) => e.type === Case).find((caseElement) => caseElement.props.on === onValue);
}

function findDefault(elements) {
    return elements.find((caseElement) => caseElement.type === Default);
}

function getBranch(elements, onValue) {
    const caseElement = findCaseElement(elements, onValue);
    if(caseElement != null) {
        return caseElement;
    }
    else {
        const defaultElement = findDefault(elements);
        return (defaultElement != null) ? (defaultElement) : (<div></div>);
    }
}
