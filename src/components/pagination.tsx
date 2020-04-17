import React from 'react';
import {Link} from 'gatsby';

type Props = {
  total: number;
  current: number;
};

const Pagination: React.FC<Props> = ({total, current}) => {
  const getPrevUrl = () => (current === 2 ? `/` : `/page${current - 1}`);
  const getNextUrl = () => `/page${current + 1}`;

  const hasNext = current < total;
  const hasPrev = current > 1;

  return (
    <div>
      {hasPrev && <Link to={getPrevUrl()}>Prev</Link>}
      {hasNext && <Link to={getNextUrl()}>Next</Link>}
    </div>
  );
};

export default Pagination;
