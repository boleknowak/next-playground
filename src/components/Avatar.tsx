import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

const Avatar = ({ src, alt, services, ...props }) => {
  const defaultAvatarSrc = '/images/default-avatar.png';

  const onError = (e) => {
    e.target.src = defaultAvatarSrc;
  };

  const [isHovered, setIsHovered] = useState(false);

  // Definicja animacji dla tła
  const backgroundAnimation = {
    initial: { opacity: 0, x: -100 },
    animate: { opacity: 1, x: 0 },
  };

  // Definicja animacji dla ikonek z avatara
  const iconsAnimation = {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
  };

  if (services) {
    return (
      <div className="group">
        <div
          className="avatar-container flex flex-row items-center"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Image
            src={src || defaultAvatarSrc}
            alt={alt || 'Profilowe'}
            onError={onError}
            {...props}
            style={{ zIndex: 1 }}
          />
          <motion.div
            className={`background -ml-10 flex h-16 w-[160px] items-center justify-center rounded-r-full bg-gray-200 pl-12 ${
              isHovered ? 'hovered' : ''
            }`}
            initial="initial"
            animate={isHovered ? 'animate' : 'initial'}
            variants={backgroundAnimation}
          >
            <motion.div
              className={`icons ${isHovered ? 'hovered' : ''}`}
              initial="initial"
              animate={isHovered ? 'animate' : 'initial'}
              variants={iconsAnimation}
            >
              <div className="-ml-4 flex flex-row items-center space-x-4">
                {services.map((service) => (
                  <Image
                    key={service.name}
                    src={`/images/${service.name}-icon.png`}
                    alt={service.name}
                    width={32}
                    height={32}
                    className="z-0"
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (services) {
    return (
      <div className="group">
        <div className="flex flex-row items-center space-x-4 rounded-l-full rounded-r-full pr-6 group-hover:bg-gray-200">
          <Image
            src={src || defaultAvatarSrc}
            alt={alt || 'Profilowe'}
            onError={onError}
            {...props}
            style={{ zIndex: 1 }}
          />
          {services.map((service) => (
            <Image
              key={service.name}
              src={`/images/${service.name}-icon.png`}
              alt={service.name}
              width={32}
              height={32}
              className="animate__animated animate__faster animate__slideInLeft z-0 hidden group-hover:block"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <Image src={src || defaultAvatarSrc} alt={alt || 'Profilowe'} onError={onError} {...props} />
  );
};

export default Avatar;
