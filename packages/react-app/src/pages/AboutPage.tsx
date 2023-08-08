import { Box, Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NFTModel from "../components/NFTModel";
import RoundedButton from "../components/RoundedButton";
import { NFTs } from "../utils/constants";

const tabs = [
  { title: `Our "C" Animal`, param: "intro" },
  { title: "Rules", param: "rules" },
  { title: "Schedule", param: "schedule" },
];

const AboutPage = () => {
  const navigate = useNavigate();
  const { param } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [tab, setTab] = useState<string>(param ?? "intro");

  useEffect(() => {
    if (param) setTab(param);
  }, [param]);

  const handleTabOnChange = (param: string) => {
    setTab(param);
    navigate(`/about/${param}`);
  };

  return (
    <>
      {/* {tabs.map((item) => {
        return (
          <RoundedButton
            key={item.title}
            variant="contained"
            sx={{
              mr: 2,
              boxShadow: "none",
              backgroundColor: tab === item.param ? "#4B648A" : "white",
              color: tab === item.param ? "white" : "#4B648A",
              "&:hover": { boxShadow: "none", backgroundColor: tab === item.param ? "white" : "#7a93b8", color: tab === item.param ? "#7a93b8" : "white" },
            }}
            onClick={() => handleTabOnChange(item.param)}
          >
            {item.title}
          </RoundedButton>
        );
      })} */}
      <Box component="div" sx={{ background: "#FFFFFF99" }} p={3} mt={3}>
        {tab === "intro" && (
          <>
            <Typography variant={isMobile ? "h5" : "h4"} textAlign="center" fontWeight="bold">
              ABOUT OUR "C" ANIMAL NFTs
            </Typography>
            <Typography variant="body1" my={3} ml={3}>
              Custonomy is always dedicated to help enterprises to usher in a new era of Web3 with its latest digital asset wallet solution. We are happy to showcase our
              metaWONDERverse at CES 2023. To provide a better understanding of how our solution is capable of accelerating the mass adoption of digital assets, we are issuing a
              series of three NFTs for the public to mint and experience our easy-to-use keyless wallet for community members.
              <br />
              By simply creating your own MPC wallet, you can mint the following three different NFTs to experience the high flexibility of our wallet and also gain more benefits
              from the engagement that you won't want to miss.
            </Typography>
            {NFTs.map((nft) => (
              <Grid container alignContent="center" spacing={2} mb={{ xs: 3, sm: 3, md: 0 }} key={nft.name}>
                <Grid item m="auto">
                  <NFTModel model={nft.model} />
                </Grid>
                <Grid item xs={12} sm={7} display="flex" flexDirection="column" justifyContent="center">
                  <Typography variant="h5" textTransform="uppercase" pb={3} fontWeight="bold">
                    {nft.name}
                  </Typography>
                  <Typography variant="body1" fontWeight="bold" pb={0.5}>
                    Usage
                  </Typography>
                  <Typography variant="body1" pb={3}>
                    {nft.usage}
                  </Typography>
                  <Typography variant="body1" fontWeight="bold" pb={0.5}>
                    Requirements
                  </Typography>
                  <Typography variant="body1" pb={3}>
                    {nft.requirements ?? "-"}
                  </Typography>
                  <Typography variant="body1" fontWeight="bold" pb={0.5}>
                    Expiry Date
                  </Typography>
                  <Typography variant="body1">{nft.expiryDate ?? "-"}</Typography>
                </Grid>
              </Grid>
            ))}
          </>
        )}
        {tab === "rules" && (
          <>
            <Typography variant={isMobile ? "h5" : "h4"} textAlign="center" fontWeight="bold">
              RULES for the metaWONDERverse GAME
            </Typography>
            <Typography variant="body1" my={3} ml={3} lineHeight={2}>
              (UPDATED OCTOBER 2022) <br />
              The rules of metaWONDERverse GAME and how to enter are as follows:
              <br />
              1. Subscribe our social media (
              <a href="https://hk.linkedin.com/company/custonomy" target="_blank" rel="noreferrer" style={{ textDecoration: "underline" }}>
                LinkedIn
              </a>{" "}
              &{" "}
              <a href="https://www.youtube.com/channel/UCLlJAHJElUK8UHC4EZVObRg" target="_blank" rel="noreferrer" style={{ textDecoration: "underline" }}>
                YouTube
              </a>{" "}
              @Custonomy) <br />
              2. Submit a free trial form and remember to answer question “Predict the price of “Ethereum” on 7th November at 5.00 PM GMT+8” and the result is subject to the price
              on Binance. <br />
              3. Mint the “Lucky Cat” NFT to your wallet on metaWONDERverse website
            </Typography>
            <Typography variant={isMobile ? "h5" : "h4"} textAlign="center" fontWeight="bold">
              TERMS & CONDITIONS
            </Typography>
            <Typography component="div" variant="body1" my={3} ml={3} lineHeight={2}>
              (UPDATED OCTOBER 2022)
              <br />
              The Winner of the game will be entitled to the prize if they meet the following terms and conditions:
              <ol>
                <li>The promoter of this game is metaWONDERverse TEAM from CUSTONOMY COMPANY LIMITED.</li>
                <li>By participating in this game , metaWONDERverse user/participant is indication his/her agreement to be bound by these terms and conditions.</li>
                <li>There is no fee to participate in this game.</li>
                <li>metaWONDERverse will not accept any responsibilities if contact details provided are incomplete or inaccurate.</li>
                <li>
                  The prize is as stated and no cash or other alternatives will be offered. The prize is not transferable. Prize is subject to availability and we reserve the right
                  to substitute any prize with another of equivalent value without giving any notice.
                </li>
                <li>
                  The winner agrees to the use of his/her name and image in any publicity material, as well as their entry. Any personal data relating to the winner or any other
                  entrants will be used solely in accordance with current [HK] data protection legislation and will not be disclosed to a third party without the entrant's prior
                  consent.
                </li>
                <li>Entry into the game will be deemed as acceptance of these terms and conditions.</li>
                <li>
                  metaWONDERverse shall have the right, at its sole discretion and at any time, to change or modify these terms and conditions, such change shall be effective
                  immediately upon posting to this webpage.
                </li>
                <li>
                  metaWONDERverse has the right to change the date and time of the announcement if needed. If there are changes, the Amendment will be announced in{" "}
                  <a href="https://hk.linkedin.com/company/custonomy" target="_blank" rel="noreferrer" style={{ textDecoration: "underline" }}>
                    LinkedIn @Custonomy
                  </a>{" "}
                  / metaWONDERverse Website. metaWONDERverse also reserves the right to cancel the competition if circumstances arise outside of its control.
                </li>
                <li>
                  The prize draw and these terms and conditions will be governed by Hong Kong law and any disputes will be subject to the exclusive jurisdiction of the courts of
                  Hong Kong Law.
                </li>
                <li>
                  The winner must fulfill and provide all the requested data and information from metaWONDERverse before the winner can legally be entitled to receive the prize.
                </li>
              </ol>
            </Typography>
          </>
        )}
        {tab === "schedule" && (
          <>
            <Typography variant={isMobile ? "h5" : "h4"} textAlign="center" fontWeight="bold">
              GAME SCHEDULE
            </Typography>
            <Typography variant="body1" my={3} ml={3} lineHeight={2}>
              If you would like to join the game, please submit the free trial form on or before 1st November at 11.59 PM GMT+8. The result of the game will be revealed on 7th
              November at 5.00 PM GMT+8 and the winner will be notified by email, be sure to keep an eye on your inbox!
              <br /> <br />
              Don't want to miss any updates about this game? Be sure to subscribe our{" "}
              <a href="https://hk.linkedin.com/company/custonomy" target="_blank" rel="noreferrer" style={{ textDecoration: "underline" }}>
                LinkedIn @Custonomy
              </a>
            </Typography>
          </>
        )}
      </Box>
    </>
  );
};

export default AboutPage;
