import React from "react";
import {Alert, Divider, Skeleton } from "antd";

interface Props {
  title: string;
  error?: boolean;
}

export const ListingsSkeleton = ({ title, error=false }: Props) => {

    const errorAlert = error ? <Alert type="error"  message="Something went wrong - please try again later" /> : null

  return (
    <div>
        {errorAlert}
      <h2>{title}</h2> 
      <Skeleton active paragraph={{rows:1}}/>
      <Divider/>
      <Skeleton active paragraph={{rows:1}}/>
      <Divider/>
      <Skeleton active paragraph={{rows:1}}/>
    </div>
  );
};
