interface Props {
    params: Promise<{ slug: string[] }>
}
export default async function Page({ params }: Props) {
    const { slug } = await params;

    return slug?.length > 0 ? <div>My Post: {slug.join(", ")}</div> : <>Default Docs Page</>

}