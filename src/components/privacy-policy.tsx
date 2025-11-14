import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Shield, Eye, Database, Lock } from 'lucide-react'

export function PrivacyPolicy() {
  return (
    <Card className="bg-gray-950 border-gray-800 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-cyan-400 flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Privacy & Data Protection
        </CardTitle>
        <CardDescription className="text-gray-400">
          Your privacy is our top priority. Learn how we protect your data.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <Eye className="h-5 w-5 text-cyan-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-white mb-1">No Data Storage</h3>
              <p className="text-sm text-gray-400">
                Your text is processed in real-time and never stored on our servers.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Database className="h-5 w-5 text-purple-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-white mb-1">Local Processing</h3>
              <p className="text-sm text-gray-400">
                Analysis happens instantly without persistent data retention.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Lock className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-white mb-1">Encrypted Communication</h3>
              <p className="text-sm text-gray-400">
                All data transmission uses secure HTTPS encryption.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-yellow-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-white mb-1">Anonymous Analytics</h3>
              <p className="text-sm text-gray-400">
                Only anonymized usage metrics are collected for improvement.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-white">Compliance Standards</h3>
            <Badge variant="outline" className="border-green-400/30 text-green-400">
              GDPR Compliant
            </Badge>
          </div>
          <ul className="text-sm text-gray-400 space-y-2">
            <li>• No personal identifiers collected or stored</li>
            <li>• Right to data deletion (no data to delete)</li>
            <li>• Transparent processing practices</li>
            <li>• No third-party data sharing</li>
          </ul>
        </div>

        <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
          <p className="text-xs text-gray-500 text-center">
            This tool is designed for educational and self-awareness purposes only. 
            It is not a substitute for professional medical advice, diagnosis, or treatment.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}