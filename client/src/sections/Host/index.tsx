import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Layout,
  Typography,
  Form,
  Input,
  InputNumber,
  Radio,
  Upload,
} from "antd";
import {
  BankOutlined,
  HomeOutlined,
  PlusOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { iconColor, displayErrorMessage } from "../../lib/utils";
import { Viewer } from "../../lib/types";
import { ListingType } from "../../lib/graphql/globalTypes";
import { UploadChangeParam } from "antd/lib/upload";

const { Content } = Layout;
const { Text, Title } = Typography;
const { Item } = Form;
interface Props {
  viewer: Viewer;
}
export const Host = ({ viewer }: Props) => {
  const [imageLoading, setImageLoading] = useState(false);
  const [imageBase64Value, setImageBase64Value] = useState<string | null>(null);
  const handleImageUpload = (info: UploadChangeParam) => {
    const { file } = info;

    if (file.status === "uploading") {
      setImageLoading(true);
      return;
    }
    if (file.status === "done" && file.originFileObj) {
      getBase64Value(file.originFileObj, (imageBase64Value) => {
        setImageBase64Value(imageBase64Value);
        setImageLoading(false);
      });
    }
  };

  if (!viewer.id || !viewer.hasWallet) {
    return (
      <Content className="host-content">
        <div className="host__from-header">
          <Title level={4} className="host__form-title">
            You have sign in and connect to Stripe to add a listing!
          </Title>
          <Text type="secondary">
            We only allow users who've signed in to our application and have
            connected with Stripe to host new listings. You can sign in at the{" "}
            <Link to="/login">login</Link> Page and connect with Stripe shortly
            after.
          </Text>
        </div>
      </Content>
    );
  }

  return (
    <Content className="host-content">
      <Form layout="vertical">
        <div className="host__from-header">
          <Title level={3} className="host__form-title">
            Hi! Let's get started listing your place.
          </Title>
          <Text type="secondary">
            In this form, we'll collect some basic and additional information
            about your listing.
          </Text>
        </div>

        <Item label="Home Type" extra="Select Apartment or House">
          <Radio.Group>
            <Radio.Button value={ListingType.APARTMENT}>
              <BankOutlined style={{ color: iconColor }} />
              <span>Apartment</span>
            </Radio.Button>
            <Radio.Button value={ListingType.HOUSE}>
              <HomeOutlined style={{ color: iconColor }} />
              <span> House </span>
            </Radio.Button>
          </Radio.Group>
        </Item>

        <Item label="Title" extra="Max Character count of 45">
          <Input
            maxLength={45}
            placeholder="The iconic and luxurious Bel-Air mansion"
          />
        </Item>
        <Item label="Description of listing" extra="Max Character count of 400">
          <Input.TextArea
            rows={3}
            maxLength={400}
            placeholder="Modern, clean and iconic home of the Fresh Prince.  Situated in the heart of Bel-Air, Los Angeles."
          />
        </Item>

        <Item label="Address">
          <Input placeholder="251 North Bristol Avenue" />
        </Item>

        <Item label="City/Town">
          <Input placeholder="Los Angeles" />
        </Item>

        <Item label="State/Province">
          <Input placeholder="California" />
        </Item>

        <Item label="Zip/Postal">
          <Input placeholder="Please enter a zip code for your listing" />
        </Item>

        <Item label="Price" extra="All prices are in $USD/day">
          <InputNumber min={0} placeholder="120" />
        </Item>

        <Item
          label="Image"
          extra="Images have to be under 1MB in size and of type JPG or PNG"
        >
          <div className="host__from-image-upload">
            <Upload
              name="image"
              listType="picture-card"
              showUploadList={false}
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              beforeUpload={beforeImageUpload}
              onChange={handleImageUpload}
            >
              {imageBase64Value ? (
                <img
                  src={imageBase64Value}
                  alt="Listing"
                  style={{ width: "100%" }}
                />
              ) : (
                <div>
                  {imageLoading ? <LoadingOutlined /> : <PlusOutlined />}
                  <div className="ant-upload-text">Upload</div>
                </div>
              )}
            </Upload>
          </div>
        </Item>

        <Item
          label="Number of Guests"
          extra="enter the max number of guest that can stay at your property"
        >
          <InputNumber min={0} placeholder="5" />
        </Item>
      </Form>
    </Content>
  );
};

const beforeImageUpload = (file: File) => {
  const fileIsValidImage =
    file.type === "image/jpeg" || file.type === " image/png";

  const fileIsValidSize = file.size / 1024 / 1024 < 1;

  if (!fileIsValidImage) {
    displayErrorMessage(
      "you are only able to upload images of type JPG or PNG"
    );
    return false;
  }
  if (!fileIsValidSize) {
    displayErrorMessage(
      "you are only able to upload images smaller than than 1MB"
    );
    return false;
  }

  return fileIsValidImage && fileIsValidSize;
};

const getBase64Value = (
  img: File | Blob,
  callback: (imageBase64Value: string) => void
) => {
  const reader = new FileReader();
  reader.readAsDataURL(img);
  reader.onload = () => {
    callback(reader.result as string);
  };
};
