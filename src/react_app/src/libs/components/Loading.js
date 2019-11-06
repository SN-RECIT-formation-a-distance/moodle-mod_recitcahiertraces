import React, { Component } from 'react';
import Components from './Components';

export class Loading extends Component{
    static defaultProps = {
        webApi: null
    };

    constructor(props){
        super(props);

        this.domRef = React.createRef();
    }

    componentDidMount(){
        if(this.props.webApi === null){ return; }

        this.props.webApi.domVisualFeedback = this.domRef.current;
    }

    render(){
        return (<div ref={this.domRef} className="Loading"><img className="Img" src={Components.assets.loading} alt={"Loading..."} /></div>);
    }
}