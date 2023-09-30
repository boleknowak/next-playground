import Image from 'next/image';

const Avatar = ({ src, alt, services, ...props }) => {
  const defaultAvatarSrc = '/images/default-avatar.png';

  const onError = (e) => {
    e.target.src = defaultAvatarSrc;
  };

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
