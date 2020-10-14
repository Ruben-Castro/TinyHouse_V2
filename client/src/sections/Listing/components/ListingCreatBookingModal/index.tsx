import React from "react";
import { Modal, Button, Divider, Typography } from "antd";
import {
  CardElement,
  injectStripe,
  ReactStripeElements,
} from "react-stripe-elements";
import moment, { Moment } from "moment";
import { KeyOutlined } from "@ant-design/icons";
import { formatListingPrice } from "../../../../lib/utils";
const { Paragraph, Text, Title } = Typography;

interface Props {
  price: number;
  checkInDate: Moment;
  checkOutDate: Moment;
  modalVisible: boolean;
  // stripe: ReactStripeElements.InjectedStripeProps ;
  setModalVisible: (modalVisible: boolean) => void;
}

export const ListingCreateBookingModal = ({
  modalVisible,
  setModalVisible,
  price,
  checkInDate,
  checkOutDate,
  stripe,
}: Props & ReactStripeElements.InjectedStripeProps) => {
  const daysBooked = checkOutDate.diff(checkInDate, "days") + 1;
  const listingPrice = price * daysBooked;

  const handleCreateBooking = async () => {
    if (!stripe) {
      return;
    }

    let { token: stripeToken } = await stripe.createToken();
    console.log(stripeToken)
  };

  return (
    <Modal
      visible={modalVisible}
      centered
      footer={null}
      onCancel={() => setModalVisible(false)}
    >
      <div className="listing-booking-modal">
        <div className="listing-booking-modal__intro">
          <Title className="listing-booking-modal__intro-title">
            <KeyOutlined></KeyOutlined>
          </Title>
          <Title level={3} className="listing-booking-modal__intro-title">
            Book your trip!
          </Title>
          <Paragraph>
            Enter your payment information to book the listing from dates
            between{" "}
            <Text mark strong>
              {moment(checkInDate).format("MMMM Do YYYY")}
            </Text>{" "}
            to{" "}
            <Text mark strong>
              {moment(checkOutDate).format("MMMM Do YYYY")}
            </Text>
            , inclusive.
          </Paragraph>
        </div>
        <Divider />
        <div className="list-bookin-modal__charge-summary">
          <Paragraph>
            {formatListingPrice(price, false)} * {daysBooked} days={" "}
            <Text strong> {formatListingPrice(listingPrice, false)}</Text>
          </Paragraph>
          <Paragraph className="listing-booking-modal__charge-summary-total">
            total = <Text mark> {formatListingPrice(listingPrice, false)}</Text>
          </Paragraph>
        </div>
        <Divider />
        <div className="listing-booking-modal__stripe-card-section">
          <CardElement
            hidePostalCode
            className="listing-booking-modal__stripe-card"
          />
          <Button
            size="large"
            type="primary"
            className="listing-booking-modal__cta"
            onClick={handleCreateBooking}
          >
            Book
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export const WrappedListingCreateBookingModal = injectStripe(
  ListingCreateBookingModal
);
