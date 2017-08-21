import React, { Component } from 'react';
import { connect } from 'react-redux';
import { set_weui } from '../../actions/index.js';
import Dialog from 'material-ui/Dialog';
import CircularProgress from 'material-ui/CircularProgress';
import './myweui.css';

const icon = {
    "none" : "",
    "warning" : "warn",
    "success" : "success-no-circle",
    "loading" : "loading"
}

// const tosatDefault = {
//     show : false,
//     text : "",
//     type : ""
// }
//
// const toastLetterDefault = {
//     show : false,
//     text : "",
// }

const confirmDefault = {
    show : false,
    title : "",
    text : "",
    buttonsClose : ()=>{},
    buttonsClick : ()=>{}
}

const alertDefault = {
    show : false,
    title : "",
    text : "",
    buttonsClick : ()=>{}
}



export class Page extends Component {
    componentWillReceiveProps(nextProps) {
        if (nextProps.toast.show && !this.props.toast.show) {
            window.setTimeout(()=> {
                let toast = {
                    show : false,
                    text : "",
                    type : ""
                }
                this.props.dispatch(set_weui({ toast }));
            }, 1500);
        }
        if (nextProps.toastLetter.show && !this.props.toastLetter.show) {
            window.setTimeout(()=> {
                let toastLetter = {
                    show : false,
                    text : "",
                }
                this.props.dispatch(set_weui({ toastLetter }));
            }, 1500);
        }



    };
    //confirm close
    confirmClose = (confirm,dispatch)=>{
        if(confirm.hasOwnProperty("buttonsClose")){
            confirm.buttonsClose();
        }
        dispatch(set_weui({ confirm:confirmDefault }));
    };
    //confirm click
    confirmClick = (confirm,dispatch)=>{
        if(confirm.hasOwnProperty("buttonsClick")){
            confirm.buttonsClick();
        }
        dispatch(set_weui({ confirm:confirmDefault }));
    };
    //alert click icon={icon[toast.type]}
    alertClick =(alert,dispatch)=>{
        if(alert.hasOwnProperty("buttonsClick")){
            alert.buttonsClick();
        }
        dispatch(set_weui({ alert:alertDefault }));
    };
    render(){
        const {
            toast,
            alert,
            confirm,
            loading,
            toastLetter,
        } = this.props;

        return (
            <div className="weuiPage">

                <Dialog
                    actions={[]}
                    modal={false}
                    open={toast.show}
                    className="toastDialog"
                    contentStyle={{width : "300px"}}
                    >
                    <div className="toastDialogContent">
                        {toast.type ==="warning" && <i className="fa fa-exclamation-circle" style={{color : "#e9a70e"}} aria-hidden="true"></i> }
                        {toast.type ==="success" && <i className="fa fa-check-circle" style={{color : "#2bab09"}} aria-hidden="true"></i> }
                        {toast.type ==="loading" && <CircularProgress size={80} thickness={5} style={{margin: "auto"}} /> }
                        <span>{toast.text || "测试数据"}</span>
                    </div>
                </Dialog>

            </div>
        )
    }

}

let data =  ({weui}) =>{
    return { ...weui };
};

Page = connect(data)(Page);

export default Page;
