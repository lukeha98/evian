import React, { useState, useRef } from 'react';
import './App.scss';
import { ReactComponent as CopyIcon } from './image/bit38_decode_copy.svg'
import { ReactComponent as QrcodeIcon } from './image/bit38_decode_address.svg'
import { ReactComponent as ScanQrcodeIcon } from './image/bit38_decode_scan.svg'
import { Link } from "react-router-dom";
import { validateConfirmation } from './utils/cryptojs-lib/src/confirmation'
import Warning from './component/warning'
import {
  getBitcoinAddress,
  getBitcoinCashAddress,
  getEthAddress,
  getLitecoinAddress,
  getXRPAddress,
  getSegwitAddress,
  getBTGAddress,
  getBnbAddress,
  getQtumAddress,
  getDashAddress,
  getDogeAddress,
  getRvnAddress,
  getZecAddress
} from './utils/cryptojs-lib/src/CryptoAddress'
import { decryptEpkVcode } from './utils/cryptojs-lib/src/bip38.js'
import {
  getLitecoinWif,
  getDashwif,
  getDogewif,
  getRvnWif,
  getZecwif
} from './utils/cryptojs-lib/src/wif.js'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import QRcode from 'qrcode.react'
import QrReader from 'react-qr-reader'

function App() {
  const [balletPassphrase, setBalletPassphrase] = useState('')
  const [confirmationCode, setConfirmationCode] = useState('')
  const [epk, setEpk] = useState('')
  const [publicKeyHex, setPublicKeyHex] = useState('')
  const [privateKeyHex, setPrivateKeyHex] = useState('')
  const [isShowRealPassphrase, setIsShowRealPassphrase] = useState(true)
  const [passphraseInputCount, setPassphraseInputCount] = useState(Array.from(new Array(20).keys()).map(num => ''))
  // Address
  const [bitcoinSegwitAddress, setBitcoinSegwitAddress] = useState('')
  const [bitcoinLegacyAddress, setBitcoinLegacyAddress] = useState('')
  const [ethereumAddress, setethereumAddress] = useState('')
  const [xrpAddress, setXrpAddress] = useState('')
  const [bitcoinCashAddress, setBitcoinCashAddress] = useState('')
  const [litecoinAddress, setLitecoinAddress] = useState('')
  const [bitcoinSVAddress, setBitcoinSVAddress] = useState('')
  const [bitcoinGoldAddress, setBitcoinGoldAddress] = useState('')
  const [bitcoinDiamondAddress, setBitcoinDiamondAddress] = useState('')
  const [bnbAddress, setBnbAddress] = useState('')
  const [qtumAddress, setQtumAddress] = useState('')
  const [etcAddress, setEtcAddress] = useState('')
  const [dashAddress, setDashAddress] = useState('')
  const [dogeAddress, setDogeAddress] = useState('')
  const [rvnAddress, setRvnAddress] = useState('')
  const [zecAddress, setZecAddress] = useState('')
  // Private Key
  const [bitcoinSegWitPrivateKeyWIF, setBitcoinSegWitPrivateKeyWIF] = useState('')
  const [bitcoinLegacyPrivateKeyWIF, setBitcoinLegacyPrivateKeyWIF] = useState('')
  const [ethereumPrivateKey, setEthereumPrivateKey] = useState('')
  const [xrpPrivateKey, setXrpPrivateKey] = useState('')
  const [bitcoinCashPrivateKeyWIF, setBitcoinCashPrivateKeyWIF] = useState('')
  const [litecoinPrivateKeyWIF, setLitecoinPrivateKeyWIF] = useState('')
  const [bitcoinSVPrivateKeyWIF, setBitcoinSVPrivateKeyWIF] = useState('')
  const [bitcoinGoldPrivateKeyWIF, setBitcoinGoldPrivateKeyWIF] = useState('')
  const [bitcoinDiamondPrivateKeyWIF, setBitcoinDiamondPrivateKeyWIF] = useState('')
  const [bnbPrivateKey, setBnbPrivateKey] = useState('')
  const [qtumPrivateKey, setQtumPrivateKey] = useState('')
  const [etcPrivateKey, setEtcPrivateKey] = useState('')
  const [dashPrivateKey, setDashPrivateKey] = useState('')
  const [dogePrivateKey, setDogePrivateKey] = useState('')
  const [rvnPrivateKey, setRvnPrivateKey] = useState('')
  const [zecPrivateKey, setzecPrivateKey] = useState('')
  //
  const [verifyLoading, setVerifyLoading] = useState(false)
  const [isShowAddress, setIsShowAddress] = useState(false)
  const [isShowprivateKey, setIsShowprivateKey] = useState(false)
  const [isShowreadQrcode, setIsShowreadQrcode] = useState(false)
  const [isDecodeLoading, setIsDecodeLoading] = useState(false)
  const [verifyButtonIsDisabled, setVerifyButtonIsdisabled] = useState(true)
  const [decryptButtonIsDISabled, setdecryptButtonIsDISabled] = useState(true)
  const inputRefs = []
  for (let i = 0; i < 24; i ++) {
    inputRefs.push(useRef());
  }
  const outputAddressWIFList = [
    {
      currency: 'btc',
      title: 'Bitcoin (BTC)',
      addressKey: 'Legacy Address (Compressed)',
      getAddressMethod: getBitcoinAddress,
      addressInputValue: bitcoinLegacyAddress,
      setAddressInputMethod: setBitcoinLegacyAddress,
      privateKeyInputValue: bitcoinLegacyPrivateKeyWIF,
      setPrivateKeyInputMethod: setBitcoinLegacyPrivateKeyWIF,
      WIFKey: 'Private Key (WIF, Compressed)',
    },
    {
      currency: 'btc',
      title: 'Bitcoin (BTC)',
      addressKey: 'SegWit Address (Compressed)',
      getAddressMethod: getSegwitAddress,
      addressInputValue: bitcoinSegwitAddress,
      setAddressInputMethod: setBitcoinSegwitAddress,
      privateKeyInputValue: bitcoinSegWitPrivateKeyWIF,
      setPrivateKeyInputMethod: setBitcoinSegWitPrivateKeyWIF,
      WIFKey: 'Private Key (WIF, Compressed)',
    },
    {
      currency: 'eth',
      title: 'Ethereum (ETH)',
      addressKey: 'Address',
      getAddressMethod: getEthAddress,
      addressInputValue: ethereumAddress,
      setAddressInputMethod: setethereumAddress,
      privateKeyInputValue: ethereumPrivateKey,
      setPrivateKeyInputMethod: setEthereumPrivateKey,
      WIFKey: 'Private Key (Hex)',
    },
    {
      currency: 'dash',
      title: 'Dash (DASH)',
      addressKey: 'Address',
      getAddressMethod: getDashAddress,
      addressInputValue: dashAddress,
      setAddressInputMethod: setDashAddress,
      privateKeyInputValue: dashPrivateKey,
      setPrivateKeyInputMethod: setDashPrivateKey,
      WIFKey: 'Private Key (WIF, Compressed)',
    },
    {
      currency: 'doge',
      title: 'Dogecoin (DOGE)',
      addressKey: 'Address',
      getAddressMethod: getDogeAddress,
      addressInputValue: dogeAddress,
      setAddressInputMethod: setDogeAddress,
      privateKeyInputValue: dogePrivateKey,
      setPrivateKeyInputMethod: setDogePrivateKey,
      WIFKey: 'Private Key (WIF, Compressed)',
    },
    {
      currency: 'ETC',
      title: 'Ethereum Classic (ETC)',
      addressKey: 'Address',
      getAddressMethod: getEthAddress,
      addressInputValue: etcAddress,
      setAddressInputMethod: setEtcAddress,
      privateKeyInputValue: etcPrivateKey,
      setPrivateKeyInputMethod: setEtcPrivateKey,
      WIFKey: 'Private Key (Hex)',
    },
    {
      currency: 'xrp',
      title: 'XRP (XRP)',
      addressKey: 'Address',
      getAddressMethod: getXRPAddress,
      addressInputValue: xrpAddress,
      setAddressInputMethod: setXrpAddress,
      privateKeyInputValue: xrpPrivateKey,
      setPrivateKeyInputMethod: setXrpPrivateKey,
      WIFKey: 'Private Key (Hex)',
    },
    {
      currency: 'btc',
      title: 'Bitcoin Cash (BCH)',
      addressKey: 'Address',
      getAddressMethod: getBitcoinCashAddress,
      addressInputValue: bitcoinCashAddress,
      setAddressInputMethod: setBitcoinCashAddress,
      privateKeyInputValue: bitcoinCashPrivateKeyWIF,
      setPrivateKeyInputMethod: setBitcoinCashPrivateKeyWIF,
      WIFKey: 'Private Key (WIF, Compressed)',
    },
    {
      currency: 'ltc',
      title: 'Litecoin (LTC)',
      addressKey: 'Address',
      getAddressMethod: getLitecoinAddress,
      addressInputValue: litecoinAddress,
      setAddressInputMethod: setLitecoinAddress,
      privateKeyInputValue: litecoinPrivateKeyWIF,
      setPrivateKeyInputMethod: setLitecoinPrivateKeyWIF,
      WIFKey: 'Private Key (WIF, Compressed)',
    },
    {
      currency: 'btc',
      title: 'Bitcoin SV (BSV)',
      addressKey: 'Address',
      getAddressMethod: getBitcoinAddress,
      addressInputValue: bitcoinSVAddress,
      setAddressInputMethod: setBitcoinSVAddress,
      privateKeyInputValue: bitcoinSVPrivateKeyWIF,
      setPrivateKeyInputMethod: setBitcoinSVPrivateKeyWIF,
      WIFKey: 'Private Key (WIF, Compressed)',
    },
    {
      currency: 'btc',
      title: 'Bitcoin Gold (BTG)',
      addressKey: 'Address',
      getAddressMethod: getBTGAddress,
      addressInputValue: bitcoinGoldAddress,
      setAddressInputMethod: setBitcoinGoldAddress,
      privateKeyInputValue: bitcoinGoldPrivateKeyWIF,
      setPrivateKeyInputMethod: setBitcoinGoldPrivateKeyWIF,
      WIFKey: 'Private Key (WIF, Compressed)',
    },
    {
      currency: 'btc',
      title: 'Bitcoin Diamond (BCD)',
      addressKey: 'Address',
      getAddressMethod: getBitcoinAddress,
      addressInputValue: bitcoinDiamondAddress,
      setAddressInputMethod: setBitcoinDiamondAddress,
      privateKeyInputValue: bitcoinDiamondPrivateKeyWIF,
      setPrivateKeyInputMethod: setBitcoinDiamondPrivateKeyWIF,
      WIFKey: 'Private Key (WIF, Compressed)',
    },
    {
      currency: 'bnb',
      title: 'Binance Coin (BNB)',
      addressKey: 'Address',
      getAddressMethod: getBnbAddress,
      addressInputValue: bnbAddress,
      setAddressInputMethod: setBnbAddress,
      privateKeyInputValue: bnbPrivateKey,
      setPrivateKeyInputMethod: setBnbPrivateKey,
      WIFKey: 'Private Key (Hex)',
    },
    {
      currency: 'qtum',
      title: 'QTUM(Qtum)',
      addressKey: 'Address',
      getAddressMethod: getQtumAddress,
      addressInputValue: qtumAddress,
      setAddressInputMethod: setQtumAddress,
      privateKeyInputValue: qtumPrivateKey,
      setPrivateKeyInputMethod: setQtumPrivateKey,
      WIFKey: 'Private Key (WIF, Compressed)',
    },
    {
      currency: 'rvn',
      title: 'Raven Coin (RVN)',
      addressKey: 'Address',
      getAddressMethod:getRvnAddress,
      addressInputValue: rvnAddress,
      setAddressInputMethod: setRvnAddress,
      privateKeyInputValue: rvnPrivateKey,
      setPrivateKeyInputMethod: setRvnPrivateKey,
      WIFKey: 'Private Key (WIF, Compressed)',
    },
    {
      currency: 'zec',
      title: 'Zcash (ZEC)',
      addressKey: 'Address',
      getAddressMethod: getZecAddress,
      addressInputValue: zecAddress,
      setAddressInputMethod: setZecAddress,
      privateKeyInputValue: zecPrivateKey,
      setPrivateKeyInputMethod: setzecPrivateKey,
      WIFKey: 'Private Key (WIF, Compressed)',
    },
  ]

  const setAddress = (publicKeyHex) => {
    outputAddressWIFList.forEach(item =>  {
      const address = item.getAddressMethod(publicKeyHex)
      item.setAddressInputMethod(address)
    })
  }
  const getPassphrase = () => {
    if (isShowRealPassphrase) {
      return formatRealPassphrase(passphraseInputCount)
    }
    return balletPassphrase
  }
  const verifyConfirmationCode = async () => {
    if (verifyButtonIsDisabled) {
      return
    }
    setVerifyLoading(true)
    try {
      const { valid, publicKeyHex } = await validateConfirmation(confirmationCode, getPassphrase())
      if (valid) {
        setPublicKeyHex(publicKeyHex)
        setAddress(publicKeyHex)
        setIsShowAddress(true)
        setVerifyLoading(false)
      } else {
        alert("The wallet passphrase or BIP38 confirmation code you entered is incorrect. Please double-check and try again.")
        setVerifyLoading(false)
      }
    } catch (error) {
      alert("The wallet passphrase or BIP38 confirmation code you entered is incorrect. Please double-check and try again.")
      setVerifyLoading(false)
    }
  }
  const decodePrivateKey = () => {
    if (decryptButtonIsDISabled) {
      return
    }
    if (!getPassphrase() || !epk) {
      alert("Please input Passphrase or Private Key")
    }
    setIsDecodeLoading(true)
    setTimeout(() => {
      try {
        const { publicKeyHex, privateKeyHex, wif } = decryptEpkVcode(epk, getPassphrase())
        setIsDecodeLoading(false)
        setPublicKeyHex(publicKeyHex)
        setPrivateKeyHex(privateKeyHex)
        setAddress(publicKeyHex)
        setIsShowAddress(true)
        setIsShowprivateKey(true)
        outputAddressWIFList.forEach(item => {
          let outputPrivateKey = ''
          switch (item.currency) {
            case 'btc':
            case 'qtum':
            case 'rvn':
              outputPrivateKey = wif
              break;
            case 'eth':
            case 'xrp':
            case 'USDT_ERC20':
            case 'LEO':
            case 'LINK':
            case 'MKR':
            case 'USDC':
            case 'HT':
            case 'TUSD':
            case 'DAI':
            case 'ETC':
            case 'BAT':
            case 'bnb':
              outputPrivateKey = privateKeyHex
              break;
            case 'dash':
              outputPrivateKey = getDashwif(privateKeyHex)
              break;
            case 'doge':
              outputPrivateKey = getDogewif(privateKeyHex)
              break;
            case 'ltc':
              outputPrivateKey = getLitecoinWif(privateKeyHex)
              break;
            case 'rvn':
              outputPrivateKey = getRvnWif(privateKeyHex)
              break;
            case 'zec':
              outputPrivateKey = getZecwif(privateKeyHex)
              break;
            default:
              outputPrivateKey = privateKeyHex
              break;
          }
          item.setPrivateKeyInputMethod(outputPrivateKey)
         })
      } catch (error) {
        console.log(error)
        alert('The encrypted private key or wallet passphrase you entered is incorrect. Please double-check and try again.')
        setIsDecodeLoading(false)
      }
    }, 0);
  }

  const outputComponent = (title, key) => {
    const inputRef = useRef()
    const [isHovered, setIsHovered] = useState(false)
    const MouseOver = (key) => {
      setIsHovered(true)

    }
    const MouseOut = () => {
      setIsHovered(false)
    }
    return (
      <div className="outputComponent">
        {isHovered ? (
          <div className="popover">
            <QRcode value={key} />
          </div>
        ) : ''}
        <div className="outputTitle">{title}</div>
        <div className="field">
          <div className="control">
            <input
              value={key}
              className="input"
              type="text"
              readOnly
              ref={inputRef}
              onFocus={() => inputRef.current.select()}
            />
            <CopyToClipboard
              text={key}
              onCopy={() => alert("Copied to clipboard")}
            >
              <span><CopyIcon /></span>
            </CopyToClipboard>
            <span
              onMouseEnter={(e) => MouseOver(key)}
              onMouseLeave={(e) => MouseOut()}
            ><QrcodeIcon /></span>
          </div>
        </div>
      </div>
    )
  }
  const formatRealPassphrase = (passphraseInputCount) => {
    const realPassphrase = passphraseInputCount.slice()
    realPassphrase.splice(4, 0, "-")
    realPassphrase.splice(9, 0, "-")
    realPassphrase.splice(14, 0, "-")
    realPassphrase.splice(19, 0, "-")
    return realPassphrase.join('').toUpperCase()
  }
  const InputItem = ({ inputIndex, value }) => {
    const onKeyDown = (e) => {
      if (e.keyCode === 8) {
        if (!passphraseInputCount[e.target.dataset.id]) {
          setTimeout(() => {
            if (inputIndex > 0) {
              setPassphraseInputCount(passphraseInputCount.map((item, index) => {
                if ((inputIndex - 1) == index) {
                  return ''
                }
                return item
              }))
              inputRefs[inputIndex - 1].current.focus()
              inputRefs[inputIndex - 1].current.select()
            }
          }, 0);
          return
        }
        setPassphraseInputCount(passphraseInputCount.map((item, index) => {
          if (e.target.dataset.id == index) {
            return ''
          }
          return item
        }))
        setTimeout(() => {
          if (inputIndex > 0) {
            inputRefs[inputIndex].current.focus()
            inputRefs[inputIndex].current.select()
          }
        }, 0);
      }
    }
  
    const onChange = (e) => {
      setPassphraseInputCount(passphraseInputCount.map((item, index) => {
        if (e.target.dataset.id == index) {
          return e.target.value
        }
        return item
      }))
      setTimeout(() => {
        if (inputIndex < 19) {
          inputRefs[inputIndex + 1].current.focus()
          inputRefs[inputIndex + 1].current.select()
        }
  
      }, 0);
    }
    return (
      <input
        data-id={inputIndex}
        className="inputItem"
        value={value}
        onChange={(e) => {onChange(e)}}
        ref={inputRefs[inputIndex]}
        onKeyDown={(e) => {onKeyDown(e)}}
        onFocus={(e) => { inputRefs[inputIndex].current.select() }}
      />
    )
  }
  const handleConfirmationCodeChange = (confirmationCode) => {
    setConfirmationCode(confirmationCode)
    if (confirmationCode.length === 75 && confirmationCode.startsWith("cfrm38")) {
      setVerifyButtonIsdisabled(false)
    } else {
      setVerifyButtonIsdisabled(true)
    }
  }
  const judgeEpk = (epk) => {
    if (epk.startsWith("6P") && epk.length === 58) {
      setdecryptButtonIsDISabled(false)
    } else {
      setdecryptButtonIsDISabled(true)
    }
  }
  const handleEPKChange = (epk) => {
    setEpk(epk)
    judgeEpk(epk)
  }

  return (
    <div className="evian">
      <div className="content container">
        <h2>BIP38 Verify & Decrypt <Link to="/bip38-intermediate-code" >Generate BIP38 Intermediate Code</Link></h2>
        <Warning
          title="SAFETY AND SECURITY NOTICE"
          content={
            [
              "We strongly recommend that you run this open-source program on a computer that is permanently offline.Online computers may be at risk of hacking and/or having malware installed, which may allow others to steal access to the private key information that will be generated and shown by this program.",
              "Anyone who knows your wallet passphrase and encrypted private key can spend all the cryptocurrency in your wallet."
            ]
          }
        />
        <div className="passphrase">
          <div className="passphrase__title commonTitle ">
            Step 1 - Enter your wallet passphrase.
            <div className="passphrase__description" >
              <span>
                {isShowRealPassphrase ?
                  'Remove the tamper-evident scratch-off to get the wallet passphrase.' :
                  'Please enter your self-selected passphrase to generate address'}
              </span>
              <span
                onClick={() => setIsShowRealPassphrase(!isShowRealPassphrase)}
                style={{
                  color: '#4A83BF',
                  cursor: 'pointer'
                }}
              >
                {isShowRealPassphrase ?
                  'Switch to standard input box' :
                  'Switch to Ballet wallet customized input box'
                }
              </span>
            </div>
          </div>
          <div className="passphrase__input">
            {isShowRealPassphrase ? (
            <div className="passphrase__real">
              {passphraseInputCount.map((item, index) => {
                return (
                  <>
                    <InputItem
                      key={index}
                      inputIndex={index}
                      value={item}
                    />
                    {!((index + 1) % 4) && (index + 1 < 17) ? (<div className="symbolInput"></div>) : ''}
                  </>
                )
              })}
            </div>
            ) : (
            <input
              className="input"
              placeholder="Enter the wallet passphrase"
              value={balletPassphrase}
              onChange={(e) => setBalletPassphrase(e.target.value)}
            />
            )}
          </div>
        </div>
        <div >
          Step 2 - Enter your wallet’s BIP38 confirmation code or encrypted private key.
        </div>
        <div className="columns is-vcentered inputContent is-desktop">
          <div className="column is-5">
            <div className="commonTitle">
              Verify using BIP38 confirmation code.
            </div>
            <div className="commonDescription">
              You can use the Ballet Crypto mobile app to get your wallet’s BIP38 confirmation code.
            </div>
            <textarea
              className="textarea"
              placeholder="Enter the confirmation code"
              value={confirmationCode}
              onChange={(e) => handleConfirmationCodeChange(e.target.value)}
            ></textarea>
            <a
              className={`button is-warning ${verifyLoading ? 'is-loading' : ''}`}
              onClick={verifyConfirmationCode}
              disabled={verifyButtonIsDisabled}
            >Verify</a>
          </div>
          <div className="column is-2 is-hidden-mobile">
            <div className="middleStyle">or</div>
          </div>
          <div className="column is-5">
            <div className="commonTitle">Decrypt using BIP38 encrypted private key.</div>
            <div className="commonDescription privateKeyDescription">
              Peel off the top layer sticker and scan the encrypted private key QR code, which is set against a yellow sticker.
              <span className="readQrcodeButton" onClick={() => setIsShowreadQrcode(!isShowreadQrcode)}>
                {isShowreadQrcode ? (
                  <div className="readQrcodeModal">
                    <QrReader
                      delay={200}
                      // onError={onReadQrcodeError}
                      onScan={(data) => {
                        if (data) {
                          setEpk(data)
                          setIsShowreadQrcode(false)
                          judgeEpk(data)
                        }
                      }}
                      style={{ width: "100%" }}
                    />
                  </div>
                ) : ''}
                <span className="readQrcodeText" ><ScanQrcodeIcon />Scan</span>
              </span>
            </div>
            <textarea
              className="textarea"
              placeholder="Enter the Private Key"
              value={epk}
              onChange={e => handleEPKChange(e.target.value)}
            ></textarea>
            <a
              className={`button is-warning ${isDecodeLoading ? 'is-loading' : ''}`}
              onClick={decodePrivateKey}
              disabled={decryptButtonIsDISabled}
            >Decrypt</a>
          </div>
        </div>
        <div className={`outWraper ${isShowAddress || isShowprivateKey ? '': 'hide'}`}>
          <div className="columns ouput">
            <div className={`column is-5 ${isShowAddress ? '': 'hide'}`} >
              {outputComponent("Wallet public key (Hex)", publicKeyHex)}
            </div>
            <div className="column is-2"></div>
            <div className={`column is-5 ${isShowprivateKey ? '': 'hide'}`}>
              {outputComponent("Wallet private key (Hex)", privateKeyHex)}
            </div>
          </div>
          {outputAddressWIFList.map((item, index) =>
            <>
              <div className="columns">
                <div className="column is-5">
                  <div className={`currencyTitle ${isShowAddress ? '': 'hide'}`}>{index + 1}.{item.title}</div>
                  <div className="columns">
                    <div className={`column ${isShowAddress ? '': 'hide'}`}>
                      {outputComponent(item.addressKey, item.addressInputValue)}
                    </div>
                  </div>
                </div>
                <div className="column is-5">
                  <div className={`is-hidden-mobile currencyTitle ${isShowAddress ? '': 'hide'}`}>{item.title}</div>
                  <div className="columns">
                    <div className={`column ${isShowprivateKey ? '': 'hide'}`}>
                      {outputComponent(item.WIFKey, item.privateKeyInputValue)}
                    </div>
                  </div>
                </div>
              </div> 
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
