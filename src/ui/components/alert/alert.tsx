import './alert.css';

type AlertProps = {
  type?: 'primary' | 'secondary';
  padding?: 'sm' | 'md';
  title: string;
  children: React.ReactNode;
};

export default function Alert({
  children,
  title,
  type = 'primary',
  padding = 'md',
}: AlertProps) {
  return (
    <div className={`alert ${type} ${padding}`}>
      <span>{title}</span>
      <div>{children}</div>
    </div>
  );
}
