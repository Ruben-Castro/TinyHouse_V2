import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import {
  Layout,
  Typography,
  Form,
  Input,
  InputNumber,
  Radio,
  Upload,
  Button,
} from "antd";
import {
  BankOutlined,
  HomeOutlined,
  PlusOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { iconColor, displayErrorMessage, displaySuccessNotification } from "../../lib/utils";
import { Viewer } from "../../lib/types";
import { ListingType } from "../../lib/graphql/globalTypes";
import { UploadChangeParam } from "antd/lib/upload";
import { useMutation } from "@apollo/react-hooks";
import { HOST_LISTING } from "../../lib/graphql/mutations";
import {
  HostListing as HostListingData,
  HostListingVariables,
} from "../../lib/graphql/mutations/HostListing/__generated__/HostListing";

const { Content } = Layout;
const { Text, Title } = Typography;

interface Props {
  viewer: Viewer;
}

export const Host = ({ viewer }: Props) => {
  const [form] = Form.useForm();

  const [hostListing, { loading, data }] = useMutation<
    HostListingData,
    HostListingVariables
  >(HOST_LISTING, {
      onCompleted: () => {
        displaySuccessNotification("You have successfully created a listing");
      },
      onError: () => {
          displayErrorMessage("Sorry! We weren't able to create your listing please try again later.")
      }
  });

  console.log(form.getFieldValue("title"));

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

  const handleHostListing = (values: any) => {
    console.log(values);

    const fullAddress = `${values.address}, ${values.city}, ${values.admin}, ${values.postal}`;
    const input = {
      ...values,
      address: fullAddress,
      image: imageBase64Value,
      price: values.price * 100,
    };

    delete input.city
    delete input.admin
    delete input.postal

    hostListing({
        variables: {
            input
        }
    })
  };

  const handleHostListingFailed = (values: any) => {
    displayErrorMessage("Please enter all fields");
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

  if (loading) {
    return (
      <Content className="host-content">
        <div className="host__from-header">
          <Title level={4} className="host__form-title">
            Please wait!
          </Title>
          <Text type="secondary">
           We're creating your listing now.
          </Text>
        </div>
      </Content>
    );
  }

  if(data && data.hostListing) { 
      return (
          <Redirect to={`/listing/${data.hostListing.id}`} />
      )
  }

  return (
    <Content className="host-content">
      <Form
        layout="vertical"
        form={form}
        onFinish={handleHostListing}
        onFinishFailed={handleHostListingFailed}
      >
        <div className="host__from-header">
          <Title level={3} className="host__form-title">
            Hi! Let's get started listing your place.
          </Title>
          <Text type="secondary">
            In this form, we'll collect some basic and additional information
            about your listing.
          </Text>
        </div>

        <Form.Item
          label="Home Type"
          extra="Select Apartment or House"
          name="type"
          rules={[{ required: true, message: "Please Select A Home type" }]}
        >
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
        </Form.Item>

        <Form.Item
          label="Title"
          extra="Max Character count of 45"
          name="title"
          rules={[
            {
              required: true,
              message: "Please enter a title for your listing.",
            },
          ]}
        >
          <Input
            maxLength={45}
            placeholder="The iconic and luxurious Bel-Air mansion"
          />
        </Form.Item>
        <Form.Item
          label="Description of listing"
          extra="Max Character count of 400"
          name="description"
          rules={[
            {
              required: true,
              message: "Please enter a description for your listing.",
            },
          ]}
        >
          <Input.TextArea
            rows={3}
            maxLength={400}
            placeholder="Modern, clean and iconic home of the Fresh Prince.  Situated in the heart of Bel-Air, Los Angeles."
          />
        </Form.Item>

        <Form.Item
          label="Address"
          name="address"
          rules={[
            {
              required: true,
              message: "Please enter an address for your listing.",
            },
          ]}
        >
          <Input placeholder="251 North Bristol Avenue" />
        </Form.Item>

        <Form.Item
          label="City/Town"
          name="city"
          rules={[
            {
              required: true,
              message: "Please enter a city or town for your listing.",
            },
          ]}
        >
          <Input placeholder="Los Angeles" />
        </Form.Item>

        <Form.Item
          label="State/Province"
          name="admin"
          rules={[
            {
              required: true,
              message: "Please enter a state or province for your listing.",
            },
          ]}
        >
          <Input placeholder="California" />
        </Form.Item>

        <Form.Item
          label="Zip/Postal"
          name="postal"
          rules={[
            {
              required: true,
              message: "Please enter a zip or postal code for your listing.",
            },
          ]}
        >
          <Input placeholder="Please enter a zip code for your listing" />
        </Form.Item>

        <Form.Item
          label="Price"
          extra="All prices are in $USD/day"
          name="price"
          rules={[
            {
              required: true,
              message: "Please enter a price for your listing.",
            },
          ]}
        >
          <InputNumber min={0} placeholder="120" />
        </Form.Item>

        <Form.Item
          label="Image"
          extra="Images have to be under 1MB in size and of type JPG or PNG"
          name="image"
          rules={[
            {
              required: true,
              message: "Please upload an image for your listing.",
            },
          ]}
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
        </Form.Item>

        <Form.Item
          label=" Max Number of Guests"
          name="numOfGuests"
          extra="enter the max number of guest that can stay at your property"
          rules={[
            {
              required: true,
              message:
                "Please enter a maximum number of guests ammount for your listing.",
            },
          ]}
        >
          <InputNumber min={0} placeholder="4" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
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
