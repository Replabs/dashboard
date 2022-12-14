import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { Button, Divider, Stack, Typography } from "@mui/material";
import "../SidePanel.css";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ParameterToggles from "../ParameterToggles";
import { TwitterHyperParams } from "../../pages/TwitterPage";
import { TwitterNode } from "./types";
import { baseUrl } from "../../utils";

type Props = {
  topResults: TwitterNode[];
  hyperParams: TwitterHyperParams;
  onUpdate: (params: TwitterHyperParams) => void;
  onSelectTopResult: (result: TwitterNode) => void;
};

type ListInfo = {
  member_count: number;
  name: string;
};

function TwitterLeftPanel(props: Props) {
  const [listInfo, setListInfo] = useState<ListInfo | null>(null);
  const [hide, setHide] = useState<boolean>(false);

  async function fetchListInfo() {
    const response = await fetch(
      `${baseUrl()}/twitter_list/${props.hyperParams.list_id}`
    ).catch(() => {
      return setHide(true);
    });

    if (!response || !response.ok) {
      return setHide(true);
    }

    const body = await response.json();
    setListInfo(body as ListInfo);
  }

  useEffect(() => {
    if (!listInfo) {
      fetchListInfo();
    }
  }, [listInfo]);

  const topResults = () => {
    return (
      <List>
        {props.topResults.map((node) => (
          <ListItem key={node.id}>
            <Button
              onClick={() => props.onSelectTopResult(node)}
              sx={{
                textTransform: "unset !important",
                textAlign: "left",
                width: "100%",
              }}
            >
              <Stack
                direction="row"
                justifyContent="left"
                alignItems="center"
                spacing={1}
                sx={{ width: "100%" }}
              >
                <AccountCircleIcon sx={{ color: "#666" }} />
                <Stack>
                  <Typography
                    sx={{ color: "#666", lineHeight: 1.1 }}
                    variant="h6"
                  >
                    {node.title}
                  </Typography>
                  <Typography
                    sx={{
                      marginTop: 0,
                      paddingTop: 0,
                      fontSize: "0.8rem",
                      color: "#666",
                    }}
                  >
                    PageRank: {(node.value / 1000).toFixed(5)}
                  </Typography>
                </Stack>
              </Stack>
            </Button>
          </ListItem>
        ))}
      </List>
    );
  };

  return (
    <div className="Drawer-Container">
      {!hide && (
        <Drawer elevation={2} anchor="left" variant="permanent">
          <Box sx={{ width: 300 }} role="presentation">
            <Typography
              sx={{
                margin: "20px 20px 0px 20px",
                fontWeight: 800,
              }}
              variant="h4"
            >
              {listInfo?.name ? listInfo.name : ""}
            </Typography>
            <Typography
              sx={{ marginLeft: "20px", marginBottom: "12px", color: "#666" }}
              variant="h6"
            >
              {listInfo?.member_count ? `${listInfo.member_count} members` : ""}
            </Typography>
            <Divider sx={{ marginBottom: "12px" }} />
            <Typography
              sx={{ margin: "20px 20px 0px 20px", fontWeight: 500 }}
              variant="h5"
            >
              Parameters
            </Typography>
            <ParameterToggles
              initialParams={props.hyperParams}
              onUpdate={(values) =>
                props.onUpdate(values as TwitterHyperParams)
              }
            />
            <Divider />
            <Typography
              sx={{ margin: "20px 20px 0px 20px", fontWeight: 500 }}
              variant="h5"
            >
              Top Results
            </Typography>
            {topResults()}
          </Box>
        </Drawer>
      )}
    </div>
  );
}

export default TwitterLeftPanel;
