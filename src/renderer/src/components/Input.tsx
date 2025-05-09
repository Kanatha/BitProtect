export default function Input(props) {
  const style =
    'w-100 h-10 border border-gray-300 focus:border-2 focus:border-blue-500 focus:outline-none rounded-lg px-3 py-2 ' +
    props.class

  return <input type={props.type} placeholder={props.placeholder} class={style} />
}
