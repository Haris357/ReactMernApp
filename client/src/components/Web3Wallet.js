/* eslint-disable no-unused-vars */
import MetaMask from '../img/fox.png'
import React, { useState,useEffect } from 'react';
import { ethers } from 'ethers';
import { ToastContainer, toast } from 'react-toastify';
import { Breadcrumbs, Button, Container, Divider, Grid, TextField } from '@mui/material';
import { CheckCircleOutline, CancelOutlined } from '@mui/icons-material';
import Web3 from 'web3';

const Web3Wallet = () => {
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [transactionValue, setTransactionValue] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');

  const ConnectWallet = () => {
    if (window.ethereum) {
      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then(result => {
          accountChanged(result[0]);
          toast.success('Wallet connected!');
        })
        .catch(error => {
          toast.error(`An error occurred: ${error.message}`);
        });
    } else {
      toast.warning('Install MetaMask Please!!!');
    }
  };

  const DisconnectWallet = () => {
    setDefaultAccount(null);
    setUserBalance(null);
    toast.info('Wallet disconnected');
  };

  const accountChanged = accountname => {
    setDefaultAccount(accountname);
    getUserBalance(accountname);
  };

  const getUserBalance = accountAddress => {
    window.ethereum
      .request({ method: 'eth_getBalance', params: [String(accountAddress), 'latest'] })
      .then(balance => {
        const formattedBalance = ethers.formatEther(balance);
        setUserBalance(formattedBalance);
      });
  };

  const sendTransaction = async () => {
    try {
      const weiValue = (parseFloat(transactionValue) * Math.pow(10, 18)).toString(16);
  
      const params = [{
        from: defaultAccount,
        to: recipientAddress,
        gas: Number(21000).toString(16),
        gasPrice: Number(2500000).toString(16),
        value: "0x" + weiValue,
      }];
  
      const result = await window.ethereum.request({ method: "eth_sendTransaction", params });

    } catch (err) {
      toast.error(err.message || "An error occurred while sending the transaction.");
    }
  };
  
  const [ethValue, setEthValue] = useState('');
  const [ethToUsdRate, setEthToUsdRate] = useState(null);

  const handleEthChange = (event) => {
    const input = event.target.value;

    if (/^\d*\.?\d*$/.test(input)) {
      setEthValue(input);
    }
  };

  const fetchEthereumPrice = async () => {
    try {
      const web3 = new Web3('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID');
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
      const data = await response.json();
      const ethPriceInUSD = data.ethereum.usd;
      setEthToUsdRate(ethPriceInUSD);
    } catch (error) {
      console.error('Error fetching Ethereum price:', error);
    }
  };

  useEffect(() => {
    fetchEthereumPrice();
  }, []);

  const calculateUsdValue = () => {
    const ethAmount = parseFloat(ethValue);
    if (!isNaN(ethAmount) && ethToUsdRate !== null) {
      return (ethAmount * ethToUsdRate).toFixed(2);
    }
    return '';
  };
  
  // const sendTransaction = async () => {
  //   debugger;
  //   if (!transactionValue || !recipientAddress) {
  //     toast.warning('Please enter both a transaction value and a recipient address');
  //     return;
  //   }

  //   const params = [
  //     {
  //       from: defaultAccount,
  //       to: recipientAddress,
  //       gas: Number(21000).toString(16),
  //       gasPrice: Number(2500000).toString(16),
  //       value: ethers.parseEther(String(transactionValue)),
  //     },
  //   ];

  //   try {
  //     // const gasEstimate = Number(21000).toString(16);//await window.ethereum.request({ method: "eth_estimateGas", params });
  //     // const gasPrice = Number(2500000).toString(16); //await window.ethereum.request({ method: "eth_gasPrice" });
  //     // params[0].gas = gasEstimate;
  //     // params[0].gasPrice = gasPrice;

  //     let result = await window.ethereum.request({method:"eth_sendTransaction",params}).catch((err) => {
  //           toast.error(err);
  //         })
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  return (
    <>
    <Grid container spacing={0}>
        <Container maxWidth='lg' className='p-1'>
          <div className='shadow-lg p-3 bg bg-white rounded'>
            <Grid container spacing={2}>
              { defaultAccount ? (
                   <>
                   <Grid item xs={12} > 
                    <Button
                        size='small'
                        variant='contained'
                        color='error'
                        onClick={DisconnectWallet}
                        startIcon={<CancelOutlined />}
                      >
                        Disconnect Wallet
                      </Button>
                   </Grid>
                    <Grid item xs={12} >
                        <p><strong>Wallet Address:</strong> {defaultAccount}</p>                   
                        <p><strong>Wallet Balance:</strong> {userBalance}</p>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        size="small"
                        label="Recipient Address"
                        variant="outlined"
                        value={recipientAddress}
                        onChange={(e) => setRecipientAddress(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        size="small"
                        label="Transaction Value (Ether)"
                        variant="outlined"
                        value={transactionValue}
                        onChange={(event) => {
                          setTransactionValue(event.target.value);
                          handleEthChange(event);
                        }}
                        InputProps={{
                          inputProps: {
                            pattern: /^\d*\.?\d*$/,
                          },
                        }}
                      />
                      <div>
                        {ethValue && ethToUsdRate !== null && (
                          <p>
                            {ethValue} Ethereum is approximately ${calculateUsdValue()} USD
                          </p>
                        )}
                      </div>
                    </Grid>
                    <Grid item xs={12}>
                      <Button color="warning" size="small" variant="contained" onClick={sendTransaction}>
                        Send Ethereum
                      </Button>
                    </Grid>
                 </>
              ) : (
                <Grid item xs={12} >
                    <Button
                      size='small'
                      variant='contained'
                      color='success'
                      onClick={ConnectWallet}
                      startIcon={<img src={MetaMask} alt="MetaMask" style={{ width: '20px', marginRight: '10px' }} />}
                      value="Send"
                    >
                      Connect to Meta Mask
                    </Button>
                </Grid> 
              )}
            </Grid>
          </div>
        </Container>
      </Grid>
      <ToastContainer position='bottom-right' />
    </>
  );
};

export default Web3Wallet;
