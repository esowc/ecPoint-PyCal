from collections import OrderedDict
from dataclasses import dataclass, field
from functools import partial
from typing import List, Optional

import attr
import pandas

from core.loaders import BasePointDataReader


@attr.s(slots=True)
class ASCIIEncoder(object):
    path = attr.ib()
    first_chunk_address_added = attr.ib(default=False)

    def add_header(self, header):
        with open(self.path, "w") as f:
            f.write(header)
            f.write("\n\n")

    def add_footer(self, footer):
        with open(self.path, "a") as f:
            f.write(footer)

    def add_columns_chunk(self, columns):
        df = pandas.DataFrame.from_dict(OrderedDict(columns))

        with open(self.path, "a") as f:
            if not self.first_chunk_address_added:
                f.write(df.to_string(index=False, col_space=10))
                self.first_chunk_address_added = True
            else:
                f.write(df.to_string(index=False, header=False, col_space=10))
            f.write("\n")


@dataclass
class ASCIIDecoder(BasePointDataReader):
    # Internal instance attributes
    _columns: Optional[list] = field(default=None, repr=False)
    _dataframe: Optional[pandas.DataFrame] = field(default=None, repr=False)

    # Fields for implementing the iterator protocol
    _current_csv_offset: int = field(default=0, repr=False)

    _chunk_size = 100000

    @property
    def _reader(self):
        return partial(
            pandas.read_csv, self.path, comment="#", skip_blank_lines=True, sep=r"\s+"
        )

    @property
    def dataframe(self) -> pandas.DataFrame:
        if self._dataframe is None:
            self._dataframe = self._reader()

        return self._dataframe

    @property
    def columns(self) -> List[str]:
        if not self._columns:
            df = self._reader(nrows=0)
            self._columns = list(df.columns)

        return self._columns

    def select(self, *args: str) -> pandas.DataFrame:
        return self._reader(usecols=args)

    def __iter__(self) -> "ASCIIDecoder":
        self._current_csv_offset = 0
        return self

    def __next__(self) -> pandas.DataFrame:
        df: pandas.DataFrame = self._reader(
            nrows=self._chunk_size,
            skiprows=self._current_csv_offset,
            header=0,
            names=self.columns,
        )

        if df.empty:
            raise StopIteration

        self._current_csv_offset += self._chunk_size
        return df
