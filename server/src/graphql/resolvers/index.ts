import merge from 'lodash.merge';
import {listingResolvers} from './Listings';
import {bookingResolvers} from './Bookings';

export const resolvers = merge(listingResolvers,bookingResolvers);