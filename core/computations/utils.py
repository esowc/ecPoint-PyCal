import operator
from functools import reduce

from ..loaders.fieldset import Fieldset


def compute_accumulated_field(*args):
    return args[-1] - args[0]


def compute_24h_solar_radiation(*args):
    return compute_accumulated_field(*args) / 86400.0


def compute_weighted_average_field(*args):
    weighted_sum_of_first_and_last_items = args[0] * 0.5 + args[-1] * 0.5
    items_excluding_first_and_last = args[1: len(args) - 1]

    if items_excluding_first_and_last:
        total_sum = reduce(
            operator.add,
            items_excluding_first_and_last,
            weighted_sum_of_first_and_last_items,
        )
        total_weight = len(items_excluding_first_and_last) * 1 + 2 * 0.5
        return total_sum / total_weight
    else:
        return weighted_sum_of_first_and_last_items


def compute_average_field(*args):
    return reduce(operator.add, args) / len(args)


def compute_vector(*args):
    return Fieldset.vector_of(*args)


def compute_maximum(*args):
    return Fieldset.max_of(*args)


def compute_minimum(*args):
    return Fieldset.min_of(*args)


def compute_ratio_field(dividend, divisor):
    return dividend / divisor


def compute_instantaneous_field_100(*args):
    return args[0]


def compute_instantaneous_field_001(*args):
    return args[-1]


def compute_instantaneous_field_010(*args):
    return args[len(args) // 2]


def compute_local_solar_time(longitudes, hour):
    """
    Compute the Local Solar Time
    """
    # Select values at the right of the Greenwich Meridian
    temp_lonPos = longitudes * (longitudes >= 0)
    # Compute the time difference between the local place and the Greenwich Meridian
    lstPos = hour + (temp_lonPos / 15.0)
    # Put back to zero the values that are not part of the subset (lonObs_1 >= 0)
    lstPos = lstPos * (temp_lonPos != 0)
    # Adjust the times that appear bigger than 24 (the time relates to the following day)
    temp_lstPosMore24 = (lstPos * (lstPos >= 24)) - 24
    temp_lstPosMore24 = temp_lstPosMore24 * (temp_lstPosMore24 > 0)
    # Restore the dataset
    tempPos = lstPos * (lstPos < 24) + temp_lstPosMore24
    # Select values at the left of the Greenwich Meridian
    temp_lonNeg = longitudes * (longitudes < 0)
    # Compute the time difference between the local place and the Greenwich Meridian
    lstNeg = hour - abs((temp_lonNeg / 15.0))
    # Put back to zero the values that are not part of the subset (lonObs_1 < 0)
    lstNeg = lstNeg * (temp_lonNeg != 0)
    # Adjust the times that appear smaller than 24 (the time relates to the previous day)
    temp_lstNegLess0 = lstNeg * (lstNeg < 0) + 24
    temp_lstNegLess0 = temp_lstNegLess0 * (temp_lstNegLess0 != 24)
    # Restore the dataset
    tempNeg = lstNeg * (lstNeg > 0) + temp_lstNegLess0
    # Combine both subsets
    return tempPos + tempNeg  # [XXX] Review this line
