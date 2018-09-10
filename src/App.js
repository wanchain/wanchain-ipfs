import {Modal, Glyphicon, Col, Grid, Button, Form} from 'react-bootstrap';
import React, {Component} from 'react';
//import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import ipfs from './ipfs';
import storehash from './storehash';

console.log(storehash)


class App extends Component {

    state = {
        ipfsHash: '',
        ipfsLink: '',
        buffer: '',
        ethAddress: storehash._address,
        blockNumber: '',
        transactionHash: '',
        gasUsed: '',
        txReceipt: '',
        show: false,
        uploading: false,
        newHash: false,
        wanAddress:'0x020f9ff77973041992ac3ff4ad754b5c8eb88848'.toUpperCase(),
    };

    constructor(props, context) {
        super(props, context);

        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);

    }

    componentDidMount() {

    }

    getHash = (event) => {
        var self = this;
        var wanAddress = self.state.wanAddress;
        var wanPassword = prompt('enter address password for '+self.state.wanAddress);
        if(wanPassword){
        self.setState({uploading: 'true'});
        web3.eth.personal.unlockAccount(self.state.wanAddress, wanPassword, function (err, resp) {
            console.log('account unlocked', true);

            storehash.methods.getHash().call().then(function (resp) {
                console.log(resp)
                self.setState({uploading: false});
                self.setState({ipfsHash: resp});
                self.setState({ipfsLink: 'https://gateway.ipfs.io/ipfs/' + resp});
            })
        });
        }
    }

    captureFile = (event) => {
        event.stopPropagation()
        event.preventDefault()
        const file = event.target.files[0]
        let reader = new window.FileReader()
        reader.readAsArrayBuffer(file)
        reader.onloadend = () => this.convertToBuffer(reader)
    };

    convertToBuffer = async (reader) => {
        //file is converted to a buffer to prepare for uploading to IPFS
        const buffer = await Buffer.from(reader.result);
        //set this buffer -using es6 syntax
        this.setState({buffer});
    };


    onClick = async () => {

        try {
            this.setState({blockNumber: "waiting.."});
            this.setState({gasUsed: "waiting..."});

            // get Transaction Receipt in console on click
            // See: https://web3js.readthedocs.io/en/1.0/web3-eth.html#gettransactionreceipt
            await web3.eth.getTransactionReceipt(this.state.transactionHash, (err, txReceipt) => {
                console.log(err, txReceipt);
                this.setState({txReceipt});
            }); //await for getTransactionReceipt

            await this.setState({blockNumber: this.state.txReceipt.blockNumber});
            await this.setState({gasUsed: this.state.txReceipt.gasUsed});
        } //try
        catch (error) {
            console.log(error);
        } //catch
    } //onClick
    handleClose() {
        this.setState({show: false});
    }

    handleShow() {
        this.setState({show: true});
    }

    onSubmit = async (event) => {
        event.preventDefault();

        //bring in user's metamask account address
        // const accounts = await web3.eth.getAccounts();

        // console.log('Sending from Metamask account: ' + accounts[0]);

        //obtain contract address from storehash.js
        var self = this;
        const ethAddress = await storehash.options.address;
        this.setState({ethAddress});

        //save document to IPFS,return its hash#, and set hash# to state

        self.setState({uploading: true});

        await ipfs.add(this.state.buffer, (err, ipfsHash) => {
            console.log(err, ipfsHash);

            //setState by setting ipfsHash to ipfsHash[0].hash
            this.setState({ipfsHash: ipfsHash[0].hash});
            this.setState({ipfsLink: 'https://gateway.ipfs.io/ipfs/' + ipfsHash[0].hash});
            var self = this;
            self.setState({newHash: 'true'});
            // call Ethereum contract method "sendHash" and .send IPFS hash to etheruem contract
            //return the transaction hash from the ethereum contract
            //see, this https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html#methods-mymethod-send
            var wanAddress = self.state.wanAddress.toUpperCase()
            var wanPassword = prompt('enter address password for '+self.state.wanAddress);
            if(wanPassword){
            web3.eth.personal.unlockAccount(wanAddress, wanPassword, function (err, resp) {
                console.log('account unlocked', true);
                storehash.methods.sendHash(ipfsHash[0].hash).send({
                    from: wanAddress,
                }, (error, transactionHash) => {
                    console.log(transactionHash);
                    self.setState({uploading: false});
                    self.setState({transactionHash: transactionHash});
                    self.setState({show: false});
                });
            });
            }

            //storehash
        }) //await ipfs.add
    }; //onSubmit 

    render() {
        const uploading = this.state.uploading;
        const newHash = this.state.newHash;
        return (
            <div className="App">


                <Col xs={12} md={12}>
                    <header className="App-header">

                        <img className="logo"
                             src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHwAAAAjCAYAAABWxm6cAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MUEyOTU0RkQ4QUNCMTFFN0EwMjhFMTRCQUZFNDJGNEMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MUEyOTU0RkU4QUNCMTFFN0EwMjhFMTRCQUZFNDJGNEMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoxQTI5NTRGQjhBQ0IxMUU3QTAyOEUxNEJBRkU0MkY0QyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoxQTI5NTRGQzhBQ0IxMUU3QTAyOEUxNEJBRkU0MkY0QyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pldv0W4AAAbBSURBVHja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"
                             alt=""/>
                        <Glyphicon glyph="plus"/>
                        <img src="/ipfs.svg" alt="" className="logo ipfs"/>

                    </header>

                    <hr/>

                    <Grid>


                        <hr/>
                        <p className="lead">
                            This example react application is using a Wanchain smart contract to store an IPFS file hash
                            that can be retreived or updated by calling the smart contract.
                        </p>
                        <div className={"wanAccount"}>
                            <p className={"lead text-center"}>Wanchain Address:</p>
                            <p><a target="_blank"
                                  href={"http://18.188.125.96/address/" + this.state.wanAddress || 'loading...'}>{this.state.wanAddress || 'loading...'}</a></p>
                            <p><small>This address will be used to pay gas to call smart contract.</small></p>
                            </div>
                        <p><a className={this.state.ipfsLink & 'btn btn-md' || 'hidden'} target="_blank"
                              href={this.state.ipfsLink}>{this.state.ipfsLink & 'Download Current File' || 'loading...'}
                            <Glyphicon glyph="download"/> </a></p>
                        <div className="hash">
                            <p className={"lead text-center"}>Wanchain Contract Address:</p>
                            <p><a target="_blank"
                                  href={"http://18.188.125.96/address/" + this.state.ethAddress || 'loading...'}>{this.state.ethAddress || 'loading...'}</a></p>
                            <p><small>This is the address of the smart contract storing the IPFS hash.</small></p>
                        </div>





                        {this.state.ipfsHash ? (

                            <div className="hash new active ipfs">

                                <p className={"lead text-center"}>IPFS File Hash:</p>
                                <p><a target="_blank" className={this.state.newHash || 'stored'}
                                      href={this.state.ipfsLink}>{this.state.ipfsHash || 'loading...'}</a></p>
                                <p><small>This is the file hash stored inside the Wanchain Smart Contract.</small></p>

                                <p>
                                    <a className={"btn btn-lg replace file"} onClick={this.handleShow}>
                                        Replace File <Glyphicon glyph="upload"/>
                                    </a>
                                </p>
                            </div>


                        ) : (
                            <div className="hash ipfs">
                                <p className={"lead text-center"}>IPFS File Hash:</p>
                                <div>
                            <div className={this.state.uploading & " disabled"}>
                                <a className={"btn btn-lg replace file"} onClick={this.getHash}>
                                    {this.state.uploading ? (<div>Calling Contract...</div>):(<div>Call Wan Contract & Get IPFS Hash <Glyphicon glyph="download"/></div>)}
                                </a>

                            </div>
                                </div>
                            </div>
                        )}



                    </Grid>
                </Col>
                <Col xs={12} md={12}>
                    <Modal show={this.state.show} onHide={this.handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Replace File</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p>Clicking the "Send It" button will upload your file to IPFS <br/> and store the hash in the
                                Wanchain smart contract.</p>
                            <div className="uploadF">
                                <Form onSubmit={this.onSubmit}>
                                    <input
                                        className={"form-control"} type="file"
                                        onChange={this.captureFile}
                                    />


                                    <div>
                                        {uploading ? (
                                            <div className={"uploadIndicator"}><p className={"alert alert-info"}>
                                                uploading..</p></div>
                                        ) : (
                                            <div></div>
                                        )}
                                    </div>
                                    {uploading ? (
                                        <div></div>
                                    ) : (
                                        <Button
                                            bsStyle="primary"
                                            type="submit">
                                            Send it to IPFS and Smart Contract <Glyphicon glyph="arrow-right"/>
                                        </Button>
                                    )}

                                </Form>
                            </div>
                        </Modal.Body>

                    </Modal>

                </Col>
                <div className="fixed-bottom"><a href="https://github.com/wanchainharry" className={'linky'}>Developer:
                    Harry Ward</a></div>
            </div>
        );
    } //render
}

export default App;
