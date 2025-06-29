import requestApi from "@/api/request/request.api";
import {
  RequestQueryParams,
  UserRequestQueryParams,
} from "@/api/request/request.input";
import { RequestPreview } from "@/api/request/request.output";
import { RequestList as RequestListType } from "@/api/RequestList";
import { Role } from "@/api/user/user.output";
import { useAuth } from "@/hooks/useAuth";
import ROUTES from "@/lib/routes";
import { hasRole } from "@/lib/utils";
import { router } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";
import CustomButton from "../basic/custom/CustomButton";
import CustomFilterButton from "../basic/custom/CustomFilterButton";
import RequestList from "./list/RequestList";
import RequestFilterModal from "./RequestFilterModal";

export default function RequestSearchContent() {
  const { information } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [requests, setRequests] = useState<RequestListType<RequestPreview>>();
  const [query, setQuery] = useState<
    RequestQueryParams | UserRequestQueryParams
  >({});
  const [page, setPage] = useState(0);

  const handleSearch = async (
    params: RequestQueryParams | UserRequestQueryParams,
    pageNum = 0,
  ) => {
    try {
      const data = hasRole(information.roles, Role.VETERINARIAN, Role.ADMIN)
        ? await requestApi.getRequests({
            ...params,
            page: pageNum,
          } as UserRequestQueryParams)
        : await requestApi.getUserRequests({
            ...params,
            page: pageNum,
          });
      setRequests(data);
      setQuery(params);
      setPage(pageNum);
      setModalVisible(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleNext = () => {
    if (requests && page < requests.totalPages - 1) {
      handleSearch(query, page + 1);
    }
  };

  const handlePrev = () => {
    if (requests && page > 0) {
      handleSearch(query, page - 1);
    }
  };

  return (
    <>
      {requests?.elements && (
        <RequestList
          requests={requests.elements}
          onRowPress={(request) => {
            router.navigate({
              pathname: ROUTES.PRIVATE.REQUEST.DETAILS,
              params: { id: request.id },
            });
          }}
        />
      )}

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          gap: 16,
          marginVertical: 8,
        }}
      >
        <CustomButton
          text="Previous"
          onPress={handlePrev}
          disabled={!requests || page <= 0}
        />
        <CustomButton
          text="Next"
          onPress={handleNext}
          disabled={!requests || page >= requests.totalPages - 1}
        />
      </View>

      <CustomFilterButton onPress={() => setModalVisible(true)} />

      <RequestFilterModal
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        onSearch={(params) => handleSearch(params, 0)}
        canSearchByUserId={hasRole(
          information.roles,
          Role.VETERINARIAN,
          Role.ADMIN,
        )}
      />
    </>
  );
}
