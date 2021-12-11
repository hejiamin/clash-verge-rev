import { useState } from "react";
import { Virtuoso } from "react-virtuoso";
import {
  Box,
  Collapse,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  SendRounded,
  ExpandLessRounded,
  ExpandMoreRounded,
  MyLocationRounded,
  NetworkCheckRounded,
  CheckCircleOutlineRounded,
} from "@mui/icons-material";
import services from "../services";
import type { ProxyItem, ProxyGroupItem } from "../services/proxy";

interface ItemProps {
  proxy: ProxyItem;
  selected: boolean;
  onClick?: (name: string) => void;
}

const Item = ({ proxy, selected, onClick }: ItemProps) => {
  return (
    <ListItem sx={{ py: 0, pl: 4 }}>
      <ListItemButton
        selected={selected}
        onClick={() => onClick?.(proxy.name)}
        sx={{ borderRadius: 1, py: 0.5 }}
      >
        <ListItemText title={proxy.name} secondary={proxy.name} />
        <ListItemIcon
          sx={{ justifyContent: "flex-end", color: "primary.main" }}
        >
          {selected && <CheckCircleOutlineRounded sx={{ fontSize: 16 }} />}
        </ListItemIcon>
      </ListItemButton>
    </ListItem>
  );
};

interface Props {
  group: ProxyGroupItem;
}

const ProxyGroup = ({ group }: Props) => {
  const [open, setOpen] = useState(false);
  const [now, setNow] = useState(group.now);

  const proxies = group.all ?? [];

  const onUpdate = async (name: string) => {
    // can not call update
    if (group.type !== "Selector") {
      // Todo
      // error Tips
      return;
    }
    const oldValue = now;
    try {
      setNow(name);
      await services.updateProxy(group.name, name);
    } catch {
      setNow(oldValue);
      // Todo
      // error tips
    }
  };

  return (
    <>
      <ListItem button onClick={() => setOpen(!open)}>
        <ListItemText
          primary={group.name}
          sx={{ my: 0.25 }}
          secondary={
            <>
              <SendRounded color="primary" sx={{ mr: 1, fontSize: 14 }} />
              <span>{now}</span>
            </>
          }
          secondaryTypographyProps={{
            sx: { display: "flex", alignItems: "center" },
          }}
        />

        {open ? <ExpandLessRounded /> : <ExpandMoreRounded />}
      </ListItem>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <Box sx={{ pl: 4, pr: 3, my: 0.5 }}>
          <IconButton size="small" title="location">
            <MyLocationRounded />
          </IconButton>
          <IconButton size="small" title="check">
            <NetworkCheckRounded />
          </IconButton>
        </Box>

        {proxies.length >= 10 ? (
          <Virtuoso
            style={{ height: "400px", marginBottom: "4px" }}
            totalCount={proxies.length}
            itemContent={(index) => (
              <Item
                proxy={proxies[index]}
                selected={proxies[index].name === now}
                onClick={onUpdate}
              />
            )}
          />
        ) : (
          <List
            component="div"
            disablePadding
            sx={{ maxHeight: "400px", overflow: "auto", mb: "4px" }}
          >
            {proxies.map((proxy) => (
              <Item
                key={proxy.name}
                proxy={proxy}
                selected={proxy.name === now}
                onClick={onUpdate}
              />
            ))}
          </List>
        )}

        <Divider variant="middle" />
      </Collapse>
    </>
  );
};

export default ProxyGroup;
