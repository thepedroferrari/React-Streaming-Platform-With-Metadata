import { usePagination } from "hooks/usePagination"
import { useLayoutEffect, useState } from "react"
import { ViaplayCategoryTitle, ViaplaySeriesPage } from "types/ViaplayApi"
import { fetchViaplayApi } from "utils/fetchViaplayApi"

interface Props {
  category: ViaplayCategoryTitle
}
export const SeriesCategory = ({ category }: Props) => {
  const { lastPage, next, page, prev } = usePagination()
  const [data, setData] = useState<ViaplaySeriesPage>()

  useLayoutEffect(() => {
    const controller = new AbortController()

    const getData = async () => {
      const viaplayData = await fetchViaplayApi(controller, category, page)
      setData(viaplayData)
      if (lastPage.current === -1) {
        lastPage.current = viaplayData._embedded["viaplay:blocks"][0].pageCount
      }
    }
    getData()

    return () => {
      controller.abort()
    }
  }, [page, category, lastPage])

  return (
    <section>
      <h1>{category}</h1>
      <button type="button" onClick={prev} value="PREV">
        PREV
      </button>
      <button type="button" onClick={next} value="NEXT">
        NEXT
      </button>
      {data?._embedded["viaplay:blocks"].map((b) => {
        const { title, _embedded } = b
        return (
          <section>
            <header>
              <h2>{title}</h2>
              <ul style={{ display: "flex" }}>
                {_embedded &&
                  _embedded["viaplay:products"]?.map((product) => {
                    const {
                      content: {
                        originalTitle,
                        people,
                        images,
                        imdb,
                        series,
                        synopsis,
                      },
                    } = product

                    return (
                      <li>
                        <img src={images.boxart.url} alt="Box Poster" />
                        <div>Title: {originalTitle}</div>
                        <div>Series: {series.title}</div>
                        <div>
                          Synopsis: <p>{synopsis}</p>
                        </div>
                        <div>
                          Actors:{" "}
                          {people?.actors?.map((a, i) =>
                            i === people?.actors?.length ? a : `${a}, `,
                          )}
                        </div>
                        <div>IMDB: {imdb?.rating}</div>
                      </li>
                    )
                  })}
              </ul>
            </header>
          </section>
        )
      })}
    </section>
  )
}