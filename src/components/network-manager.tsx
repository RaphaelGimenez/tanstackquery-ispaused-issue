import React, { useEffect, useState } from "react";
import { onlineManager, useMutationState } from "@tanstack/react-query";
import { IconWifi, IconWifiOff } from "@tabler/icons-react";
import { Box, Button, Center, Group, Indicator, Stack } from "@mantine/core";
import classes from "./network-manager.module.css";

const NetworkManager: React.FC = () => {
  const [isOnline, setIsOnline] = useState(onlineManager.isOnline());

  const pendingMutations = useMutationState({
    filters: {
      status: "pending",
      mutationKey: [],
    },
  });

  const toggleOnline = () => {
    if (!onlineManager.isOnline() && navigator.onLine) {
      onlineManager.setOnline(true);
    } else if (onlineManager.isOnline()) {
      onlineManager.setOnline(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onlineManager.subscribe(() => {
      setIsOnline(onlineManager.isOnline());
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const bg = isOnline ? "green" : "red";

  const icon = isOnline ? <IconWifi /> : <IconWifiOff />;

  return (
    <Box p="xs" bg={bg} h="100%">
      <Center w="100%" h="100%">
        <Stack gap={0} c="white">
          <Group gap="sm" align="center" justify="center">
            <Indicator
              disabled={!pendingMutations.length}
              color={"orange"}
              classNames={{
                indicator: pendingMutations.length > 0 ? classes.indicator : "",
              }}
            >
              <Button
                variant="light"
                color="white"
                size="compact-md"
                rightSection={icon}
                onClick={toggleOnline}
              >
                {isOnline ? "Online" : "Offline"}
              </Button>
            </Indicator>
          </Group>
        </Stack>
      </Center>
    </Box>
  );
};

export default NetworkManager;
