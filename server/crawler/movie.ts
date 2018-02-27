import * as puppeteer from 'puppeteer'

const sleep = duration => new Promise(resolve => setTimeout(resolve, duration))

const run = async () => {
  console.log('launch trailer')
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  const detailUrl = `https://movie.douban.com/subject/`
  const doubanId = 27079310

  await page.goto(detailUrl + doubanId, {
    waitUntil: 'networkidle2'
  })
  await sleep(1000)

  const result = await page.evaluate(() => {
    const $ = (window as any).$
    const target = $('.related-pic-video')
    const cover = target.find('img').attr('src')
    const pageLink = target.attr('href')
    return {
      cover,
      pageLink
    }
  })

  const video = await page.goto(result.pageLink)

  const data = await page.evaluate(() => {
    const $ = (window as any).$
    const target = $('source')
    const videoLink = target.attr('src')
    const videoId = Number(
      $('.video-js')
        .attr('id')
        .split('-')[2]
    )
    return {
      videoId,
      videoLink
    }
  })

  browser.close()

  process.send({ ...data, ...result, ...{ doubanId } })
  process.exit(0)
}

run()
