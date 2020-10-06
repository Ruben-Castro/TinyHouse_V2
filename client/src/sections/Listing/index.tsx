import React, { useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { LISTING } from "../../lib/graphql/queries";
import {
  Listing as ListingData,
  ListingVariables,
} from "../../lib/graphql/queries/Listing/__generated__/Listing";
import { RouteComponentProps } from "react-router-dom";
import { PageSkeleton, ErrorBanner } from "../../lib/components";
import { Layout } from "antd";

interface MatchParams {
  id: string;
}

const PAGE_LIMIT = 3;

const { Content } = Layout;

export const Listing = ({ match }: RouteComponentProps<MatchParams>) => {
  const [bookingsPage, setBookingsPage] = useState(1);

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

  

  return <h2>Listing</h2>;
};
