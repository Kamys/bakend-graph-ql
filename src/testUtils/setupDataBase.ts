import { createTestConnection } from "./createTestConnection";

const main = async () => {
    try {
        await createTestConnection({
            dropSchema: true
        })
    } finally {
        process.exit()
    }
}

main()