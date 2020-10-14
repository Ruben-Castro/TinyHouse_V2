import React, { useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { LISTING } from "../../lib/graphql/queries";
import {
  Listing as ListingData,
  ListingVariables,
} from "../../lib/graphql/queries/Listing/__generated__/Listing";
import { RouteComponentProps } from "react-router-dom";
import { PageSkeleton, ErrorBanner } from "../../lib/components";
import { Col, Layout, Row } from "antd";
import {
  ListingDetails,
  ListingBookings,
  ListingCreateBooking,
  WrappedListingCreateBookingModal as ListingCreateBookingModal ,
} from "./components";
import { Moment } from "moment";
import { Viewer } from "../../lib/types";
interface MatchParams {
  id: string;
}
interface Props {
  viewer: Viewer;
}

const PAGE_LIMIT = 3;

const { Content } = Layout;

export const Listing = ({
  match,
  viewer,
}: Props & RouteComponentProps<MatchParams>) => {
  const [bookingsPage, setBookingsPage] = useState(1);
  const [checkInDate, setCheckInDate] = useState<Moment | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Moment | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const { loading, data, error } = useQuery<ListingData, ListingVariables>(
    LISTING,
    {
      variables: {
        id: match.params.id,
        bookingsPage,
        limit: PAGE_LIMIT,
      },
    }
  );

  if (error) {
    return (
      <Content>
        <ErrorBanner description="This Listing may not exist or we've encountered and error. Please try again soon!" />
        <PageSkeleton />
      </Content>
    );
  }

  if (loading) {
    return (
      <Content>
        <PageSkeleton />
      </Content>
    );
  }

  const listing = data ? data.listing : null;
  const listingBookings = listing ? listing.bookings : null;

  const ListingDetailsElement = listing ? (
    <ListingDetails listing={listing} />
  ) : null;
  const listingBookingsElement = listingBookings ? (
    <ListingBookings
      listingBookings={listingBookings}
      BookingsPage={bookingsPage}
      limit={PAGE_LIMIT}
      setBookingsPage={setBookingsPage}
    />
  ) : null;

  const listingCreateBookingElement = listing ? (
    <ListingCreateBooking
      host={listing.host}
      bookingsIndex={listing.bookingsIndex}
      viewer={viewer}
      price={listing.price}
      checkInDate={checkInDate}
      checkOutDate={checkOutDate}
      setCheckInDate={setCheckInDate}
      setCheckOutDate={setCheckOutDate}
      setModalVisible={setModalVisible}
    />
  ) : null;

  const listingCreateBookingModalElement =
    listing && checkInDate && checkOutDate ? (
      <ListingCreateBookingModal
        price={listing.price}
        checkInDate={checkInDate}
        checkOutDate={checkOutDate}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    ) : null;

  return (
    <Content className="listings">
      <Row gutter={24} justify="space-between">
        <Col xs={24} lg={14}>
          {ListingDetailsElement}
          {listingBookingsElement}
        </Col>
        <Col xs={24} lg={10}>
          {listingCreateBookingElement}
        </Col>
      </Row>
      {listingCreateBookingModalElement}
    </Content>
  );
};
