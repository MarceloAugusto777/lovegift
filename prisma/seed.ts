import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const templates = [
    { name: 'Romântico', slug: 'romantic', description: 'Tons de rosa, corações flutuantes e animações suaves', previewColor: '#e11d48' },
    { name: 'Casamento', slug: 'wedding', description: 'Elegante, dourado, flores delicadas', previewColor: '#d97706' },
    { name: 'Aniversário', slug: 'birthday', description: 'Festivo, confetes, cores vibrantes', previewColor: '#7c3aed' },
    { name: 'Pedido de Namoro', slug: 'proposal', description: 'Surpresa, emotivo, efeitos de fogos', previewColor: '#1e293b' },
    { name: 'Presente', slug: 'generic', description: 'Versátil, minimalista, personalizável', previewColor: '#6366f1' },
    { name: 'Dia dos Namorados', slug: 'valentine', description: 'Especial, tema amor eterno', previewColor: '#be123c' }
  ]

  for (const template of templates) {
    await prisma.template.upsert({
      where: { slug: template.slug },
      update: {},
      create: template
    })
    console.log(`✅ Template "${template.name}" criado`)
  }

  const adminEmail = 'admin@lovegift.com'
  const adminPassword = await bcrypt.hash('admin123', 10)

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { isAdmin: true },
    create: {
      email: adminEmail,
      password: adminPassword,
      name: 'Administrador',
      isAdmin: true,
    }
  })
  console.log(`✅ Admin criado: ${adminEmail} / admin123`)

  console.log('\n🎉 Todos os templates foram criados!')
}

main()
  .catch((e) => {
    console.error('❌ Erro:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
