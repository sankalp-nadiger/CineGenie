import React from 'react';
import Image from 'next/image';
import styled from 'styled-components';

const SpinningLogo: React.FC = () => {
  return (
    <StyledWrapper>
    <div className="coin">
      {/* Front Side with Chat Icon */}
      <div className="side front">
        <Image 
          src="/cinegenie logo.png" 
          alt="CineGenie Logo" 
          width={200} 
          height={200} 
          priority
        />
      </div>
  
      {/* Back Side with Chat Icon */}
      <div className="side back">
        <Image 
          src="/cinegenie logo.png" 
          alt="CineGenie Logo" 
          width={200} 
          height={200} 
          priority
          className="img_back"
        />
        <div className="chat-icon">💬</div>
      </div>
    </div>
  </StyledWrapper>
  

  );
}

const StyledWrapper = styled.div`
  .coin {
  /* Retain your thickness, size and font-size */
  width: 0.2em;
  height: 1em;
  font-size: 200px;
  position: absolute;
  top: 50%;           /* Center vertically */
  right: 40%;         /* Position 10% from the right edge */
  /* Remove the previous top, left, right, bottom settings */
  animation: rotate_spin 7s infinite linear;
  transform-style: preserve-3d;
}
.coin .side, .coin:before, .coin:after {
  content: "";
  position: absolute;
  width: 1em;
  height: 1em;
  overflow: hidden;
  /* Remove the circular shape */
  border-radius: 0;
    right: -0.4em;
    text-align: center;
    line-height: 1;
    transform: rotateY(-90deg);
    -moz-backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
  }

  .coin .back, .coin:after {
    left: -0.4em;
    transform: rotateY(90deg);
  }

  .coin:before, .coin:after {
    background: transparent;
    backface-visibility: hidden;
    transform: rotateY(90deg);
  }

  .coin:after {
    transform: rotateY(-90deg);
  }

@keyframes rotate_spin {
  0% {
    transform: translateY(-50%) rotateY(0deg);
  }
  100% {
    transform: translateY(-50%) rotateY(360deg);
  }
}

  .img_back {
    transform: scaleX(-1);
  }
    .chat-icon {
  position: absolute;
  /* Try adjusting these percentages */
  top: 11%;     /* Move up/down to get near the hand */
  left: 79%;    /* Move left/right to align with the hand */
  transform: translate(-50%, -50%);

  /* Icon size & style */
  width: 40px;
  height: 0px;
  background: white;
  color: black;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 33px;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 10;
  animation: bounce 1s infinite alternate;
}

.side.back .chat-icon {
  transform: scaleX(-1) translate(-50%, -50%);
}

/* bounce animation */
@keyframes bounce {
  0%   { transform: translate(-50%, -50%) scaleX(1); }
  100% { transform: translate(-50%, -55%) scaleX(1); }
}

`;

export default SpinningLogo;