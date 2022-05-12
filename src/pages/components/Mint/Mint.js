/* eslint-disable no-extra-bind */
/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unreachable */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from "react";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Web3 from "web3";
import "@metamask/legacy-web3";

import config from "../../../lib/config";
import MINT_ABI from "../../../ABI/singlemint.json";

import { toast } from "react-toastify";

import { getReceipt } from "../../../actions/tokenactions";
import ipfs from "../../../actions/ipfs";

toast.configure();
let toasterOption = config.toasterOption;
const MintContract = config.SINGLE_CONTRACT;

var web3 = new Web3(window.ethereum);

const MINT_SMART_CONTRACT = new web3.eth.Contract(MINT_ABI, MintContract);

const MINTComponent = (props) => {
  const { ...rest } = props;

  const [Account, set_Accounts] = useState("");
  const [Balance, set_Balance] = useState(0);
  const [Buyquantity, set_Buyquantity] = useState(1);
  const [TotalAmount, set_TotalAmount] = useState(0);
  const [ConnectionStatus, set_ConnectionStatus] = useState(false);
  const [Loader, set_Loader] = useState(false);
  const [inputList, setInputList] = useState([{ size: "", value: "" }]);
  const [ceroValue, setCeroValue] = useState("");
  const [FormSubmitLoading, Set_FormSubmitLoading] = useState(false);
  const [UserWhitelisted, Set_UserWhitelisted] = useState(false);

  const [Name, Set_Name] = useState("");
  const [Description, Set_Description] = useState("");
  const [ValidateError, setValidateError] = useState({});

  const [TokenFile, setTokenFile] = useState("");
  const [TokenFilePreReader, setTokenFilePreReader] = useState("");
  const [TokenFilePreUrl, setTokenFilePreUrl] = useState("");
  const [ImageBuffer, set_ImageBuffer] = useState("");

  useEffect(() => {
    CheckConnected();
  }, []);

  useEffect(() => {
    WhitelistCheck();
  }, [Account]);

  async function WhitelistCheck() {
    if (Account !== "") {
      var whitelisted = await MINT_SMART_CONTRACT.methods
        .isWhitelisted(Account)
        .call();
      Set_UserWhitelisted(whitelisted);
    }
  }

  async function CheckConnected() {
    if (window.ethereum) {
      try {
        const web3 = await new Web3(window.ethereum);
        if (typeof web3 !== "undefined") {
          if (window.web3.currentProvider.isMetaMask === true) {
            if (window.web3.currentProvider.networkVersion != null) {
              if (
                window.web3.currentProvider.networkVersion ===
                config.networkVersion
              ) {
                await web3.eth.getAccounts(async function (error, result) {
                  if (result && result[0]) {
                    set_Accounts(result[0]);
                    console.log("result[0]result[0]", result[0]);
                    set_ConnectionStatus(true);
                    var balance = await web3.eth.getBalance(result[0]);
                    set_Balance(balance / config.decimalvalues);
                  }
                });
              } else {
                toast.error(
                  "Please Connect to " + config.PrefferedNetwork,
                  toasterOption
                );
              }
            }
          }
        }
      } catch (err) {}
    }
  }

  async function connectMetamask() {
    if (window.ethereum) {
      var web3 = new Web3(window.ethereum);
      try {
        if (typeof web3 !== "undefined") {
          window.ethereum.enable().then(async function () {
            const web3 = new Web3(window.web3.currentProvider);
            if (window.web3.currentProvider.isMetaMask === true) {
              await web3.eth.getAccounts(async function (error, result) {
                set_Accounts(result[0]);
                set_ConnectionStatus(true);
                var balance = await web3.eth.getBalance(result[0]);
                set_Balance(balance / config.decimalvalues);
              });
            } else {
              toast.error("Please Add Metamask External", toasterOption);
            }
          });
        } else {
          toast.error("Please Add Metamask External", toasterOption);
        }
      } catch (err) {}
    }
  }

  window.addEventListener("load", (event) => {
    event.preventDefault();
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", async function (accounts) {
        window.location.reload(false);
        window.ethereum.enable().then(async function () {
          const web3 = await new Web3(window.web3.currentProvider);
          await web3.eth.getAccounts(async function (error, result) {
            set_Accounts(result[0]);
            set_ConnectionStatus(true);
            var balance = await web3.eth.getBalance(result[0]);
            set_Balance(balance / config.decimalvalues);
          });
        });
      });

      window.ethereum.on("networkChanged", function (networkId) {
        console.log("Networkdddid ", typeof networkId);
        if (networkId === config.networkVersion) {
          //   window.location.reload(false);
        } else {
          toast.error(
            "Please Connect to " + config.PrefferedNetwork,
            toasterOption
          );
        }
      });
    }
  });

  async function CreateValidation() {
    var ValidateError = {};

    if (Name === "") {
      ValidateError.Name = '"Name" is not allowed to be empty';
    }
    if (Description === "") {
      ValidateError.Description = '"Description" is not allowed to be empty';
    }

    if(TokenFile===""){
      ValidateError.Image = '"Image" is not allowed to be empty';

    }

    setValidateError(ValidateError);
    return ValidateError;
  }

  async function MintCall() {
    Set_FormSubmitLoading(true);

    if (!window.ethereum) {
      toast.error("Oops! Please Connect your wallet", toasterOption);
      return false;
    }

    var errors = await CreateValidation();
    var errorsSize = Object.keys(errors).length;

    if (errorsSize !== 0) {
      toast.error(
        "Form validation error. Fix all errors and submit again",
        toasterOption
      );
      Set_FormSubmitLoading(false);

      return false;
    }

    if (!UserWhitelisted) {
      toast.error("User is Not Whitelisted", toasterOption);
      Set_FormSubmitLoading(false);

      return false;
    }
    var mintCall = null;
    var receipt = null;
    var handle = null;
    var web3 = new Web3(window.ethereum);
    var CurrAddr = window.web3.eth.defaultAccount;
    if (!CurrAddr) {
      toast.warning("OOPS!..connect Your Wallet", toasterOption);
      return false;
    }

    let ipfsimagehash = "";
    if (TokenFile !== "") {
      const imagefile = {
        path: "Nfttask",
        // content: Buffer.from(TokenFile),
        content: ImageBuffer,
      };
      const filesAdd = await ipfs.add(imagefile);
      ipfsimagehash = filesAdd[0] && filesAdd[0].hash;
      console.log(
        "🚀 ~ file: Mint.js ~ line 199 ~ MintCall ~ ipfsimagehash",
        ipfsimagehash
      );
    }

    var properties = [];

    inputList.map((item) => {
      if (item.size !== "" && item.value !== "") {
        properties.push({
          trait_type: item.size,
          value: item.value,
        });
      }
    });

    console.log(
      "🚀 ~ file: Mint.js ~ line 204 ~ MintCall ~ properties",
      properties
    );

    const metadata = {
      name: Name,
      image: config.ipfsurl + ipfsimagehash,
      attributes: properties,
      TokenDescription: Description,
    };


    const rafflejson = {
      path: "Task",
      content: Buffer.from(JSON.stringify(metadata)),
    };
    const RaffleJsonFile = await ipfs.add(rafflejson);



    let RaffleMeta = RaffleJsonFile[0] && RaffleJsonFile[0].hash;

     var metadatajson = config.ipfsurl+RaffleMeta
    var ContractCall = await MINT_SMART_CONTRACT.methods.MintNft(
      Name,
      ipfsimagehash,
      metadatajson
    );
    try {
      set_Loader(true);
      await ContractCall.send({ from: CurrAddr }).on(
        "transactionHash",
        (transactionHash) => {
          mintCall = transactionHash;
          if (mintCall) {
            handle = setInterval(async () => {
              receipt = await getReceipt(web3, transactionHash);
              ////console.log("receipt", receipt)
              clrtrns();
            }, 2000);
          }
        }
      );
    } catch (err) {
      set_Loader(false);

      console.log("errreerere", err);
      toast.error("Mint Not Successfull", toasterOption);
    }

    async function clrtrns() {
      if (receipt != null) {
        clearInterval(handle);
        set_Loader(false);

        if (receipt.status === true) {
          var transactionHash = mintCall;
          console.log("transactionHashtransactionHash", transactionHash);
          toast.success("Your NFT created successfully", toasterOption);
        }
      }
    }
  }

  const propertyInputChange = (e, index, length) => {
    const { name, value, id } = e.target;
    const list = [...inputList];
    list[index][name] = value;
    setInputList(list);
  };

  const onCero = (e) => {
    if (e.keyCode === 46 || e.keyCode === 8) {
      setCeroValue(e.keyCode);
    } else {
      setCeroValue("");
    }
  };
  const handleAddClick = () => {
    setInputList([...inputList, { size: "", value: "" }]);
  };
  const handleRemoveClick = (index) => {
    const list = [...inputList];
    list.splice(index, 1);
    setInputList(list);
  };
  const inputChange = (e) => {
    if (
      e &&
      e.target &&
      typeof e.target.value != "undefined" &&
      e.target.name
    ) {
      var value = e.target.value;
      switch (e.target.name) {
        case "Name":
          Set_Name(value);
          break;
        case "Description":
          Set_Description(value);
          break;
        default:
      }
    }
  };
  const selectFileChange = async (e) => {
    let imageFormat = /\.(png|gif|jpeg|jpg|webp|PNG|GIF|WEBP|JPEG|JPG)$/;
    if (e.target.files[0].size > 3000000) {
      setValidateError({ TokenFilePreUrl: "Image must be lesser than 3 MB" });
    } else if (!imageFormat.test(e.target.files[0].name)) {
      setValidateError({
        TokenFilePreUrl: "Selected image must be PNG,GIF,WEBP",
      });
    } else {
      if (e.target && e.target.files) {
        setValidateError("");
        var reader = new FileReader();

        var file = e.target.files[0];
        setTokenFile(file);

        var url = reader.readAsDataURL(file);

        reader.onloadend = async function (e) {
          if (reader.result) {
            setTokenFilePreReader(reader.result);
            //  var  bufferfile = await Buffer(reader.result)

            //  set_ImageBuffer(bufferfile);
          }
        }.bind(this);

        let newreader = new window.FileReader();
        newreader.readAsArrayBuffer(file);
        newreader.onloadend = () => convertToBuffer(newreader);

        setTokenFilePreUrl(e.target.value);
      }
    }
  };

  const convertToBuffer = async (reader) => {
    //file is converted to a buffer to prepare for uploading to IPFS
    const buffer = await Buffer.from(reader.result);
    //set this buffer -using es6 syntax
    // this.setState({buffer});
    set_ImageBuffer(buffer);
  };

  return (
    <div id="mint">
      <div className="px-3 px-md-5 py-5 position-relative h-100 mb-1 mt-body">
        <div className="row">
          <div className="col-lg-6 mb-4 mb-lg-0 d-flex justify-content-center align-item-center">
            {TokenFilePreUrl === "" ? (
              <img
                className="img-fluid round-custom h-100 w-75"
                loading="lazy"
                src={require("../../../assets/img/logo.png").default}
                alt="#"
              />
            ) : (
              <img
                className="img-fluid round-custom h-100 w-75"
                loading="lazy"
                src={
                  TokenFilePreReader !== ""
                    ? TokenFilePreReader
                    : require("../../../assets/img/logo.png").default
                }
                alt="#"
              />
            )}

            {/* <img
              src={require("../../../assets/img/gallery/main.gif").default}
              className="img-fluid round-custom h-100 w-75"
              alt="#"
            /> */}
          </div>
          <div className="col-lg-6">
            <div>
              <div className="claim-text-wrapper">
                <div className="payment-modal">
                  <div className="payment-header">
                    <div className="payment-header-text">
                      <h4>CREATE NFT</h4>
                    </div>

                    <img
                      className="payment-header-img"
                      src={require("../../../assets/img/logo.png").default}
                      alt="logo"
                    />
                  </div>

                  <Form className="row">
                    <div className="col-lg-6">
                      <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="e.g. Name"
                          name="Name"
                          onChange={inputChange}
                        />
                        {ValidateError.Name && (
                          <Form.Text className="text-danger">
                            {ValidateError.Name}{" "}
                          </Form.Text>
                        )}
                      </Form.Group>
                    </div>
                    <div className="col-lg-6">
                      <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="e.g. Description"
                          name="Description"
                          onChange={inputChange}
                        />
                        {ValidateError.Description && (
                          <Form.Text className="text-danger">
                            {ValidateError.Description}{" "}
                          </Form.Text>
                        )}
                      </Form.Group>
                    </div>

                    <div className="col-lg-6">
                      <Form.Group
                        className="mb-3"
                        controlId="formBasicPassword"
                      >
                        <Form.Label>Upload File</Form.Label>
                        <Form.Control
                          type="file"
                          placeholder="file uplode"
                          onChange={selectFileChange}
                        />
                        {ValidateError.Image && (
                          <Form.Text className="text-danger">
                            {ValidateError.Image}{" "}
                          </Form.Text>
                        )}
                      </Form.Group>
                    </div>

                    <div className="form-group col-lg-6 mb-4">
                      <label
                        className="primary_label form-label"
                        htmlFor="desccription"
                      >
                        Properties{" "}
                        <span className="text-muted">(Optional)</span>
                        <i
                          className="fas fa-plus-circle ms-2 curson_point"
                          onClick={handleAddClick}
                        ></i>
                      </label>
                      {inputList.map((x, i) => {
                        var length = inputList.length;
                        return (
                          <div className="form-row row">
                            <div className="col-md-6 pl-2">
                              <input
                                type="text"
                                className="form-control primary_inp"
                                id="size"
                                value={x.size}
                                name="size"
                                onKeyDown={(e) => onCero(e)}
                                onChange={(e) => {
                                  propertyInputChange(e, i, length);
                                }}
                                placeholder="e.g. key: 'Size'"
                              />
                            </div>
                            <div className="col-md-6 pl-2">
                              <input
                                type="text"
                                className="form-control primary_inp"
                                id="value"
                                name="value"
                                value={x.value}
                                onKeyDown={(e) => onCero(e)}
                                onChange={(e) => {
                                  propertyInputChange(e, i, length);
                                }}
                                placeholder="value: 'Large'"
                              />
                            </div>
                            {i > 0 && (
                              <i
                                className="fas fa-window-close  curson_point"
                                style={{ color: "white" }}
                                onClick={(e) => {
                                  handleRemoveClick(i);
                                }}
                              ></i>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </Form>
                </div>

                {!ConnectionStatus && (
                  <Button
                    onClick={connectMetamask}
                    className="w-100 round-custom purchase-button-wrapper"
                    size="lg"
                  >
                    CONNECT WALLET
                  </Button>
                )}
                {ConnectionStatus && (
                  <Button
                    onClick={MintCall}
                    className="w-100 round-custom purchase-button-wrapper"
                    size="lg"
                    disabled={FormSubmitLoading}
                  >
                    MINT
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MINTComponent;
