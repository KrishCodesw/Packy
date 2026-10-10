'use client';

import { useEffect, useState } from 'react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';

export default function Marketplace() {
  const [skills, setSkills] = useState<Array<any>>([]);
  const [mcps, setMcps] = useState<Array<any>>([]);
  const [prompts, setPrompts] = useState<Array<any>>([]);
  const [activeTab, setActiveTab] = useState('skills');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  // Mock data - in a real app, this would come from an API
  const mockSkills = [
    { id: 1, name: 'Code Review', description: 'Review code for correctness and maintainability.', author: 'Packy Team', downloads: 1240 },
    { id: 2, name: 'Security Audit', description: 'Scan for vulnerabilities and security issues.', author: 'SecureDev', downloads: 890 },
    { id: 3, name: 'Performance Optimizer', description: 'Identify performance bottlenecks and suggest improvements.', author: 'PerfMaster', downloads: 650 },
    { id: 4, name: 'Doc Generator', description: 'Automatically generate documentation from code comments.', author: 'DocuBot', downloads: 420 },
  ];

  const mockMcps = [
    { id: 1, name: 'GitHub MCP', description: 'Integrate with GitHub for PR reviews and issue management.', author: 'Packy Team', downloads: 2100 },
    { id: 2, name: 'Postgres MCP', description: 'Connect to PostgreSQL databases for data operations.', author: 'DataConnect', downloads: 950 },
    { id: 3, name: 'Filesystem MCP', description: 'Read/write files and manage local storage.', author: 'Packy Team', downloads: 1800 },
    { id: 4, name: 'Browser MCP', description: 'Automate browser interactions and scraping.', author: 'WebAutomate', downloads: 1100 },
  ];

  const mockPrompts = [
    { id: 1, name: 'Code Review', description: 'Review the current changes for correctness and best practices.', author: 'Packy Team', downloads: 1500 },
    { id: 2, name: 'Explain Code', description: 'Explain complex code sections in simple terms.', author: 'EduDev', downloads: 980 },
    { id: 3, name: 'Generate Tests', description: 'Create unit tests based on existing code.', author: 'TestGen', downloads: 720 },
    { id: 4, name: 'Refactor Suggestion', description: 'Suggest refactoring opportunities to improve code quality.', author: 'RefactorBot', downloads: 550 },
  ];

  useEffect(() => {
    // Simulate API calls
    setSkills(mockSkills);
    setMcps(mockMcps);
    setPrompts(mockPrompts);
  }, []);

  const filteredSkills = skills.filter(skill => 
    skill.name.toLowerCase().includes(search.toLowerCase()) &&
    (filter === 'all' || skill.downloads > 1000)
  );

  const filteredMcps = mcps.filter(mcp => 
    mcp.name.toLowerCase().includes(search.toLowerCase()) &&
    (filter === 'all' || mcp.downloads > 1500)
  );

  const filteredPrompts = prompts.filter(prompt => 
    prompt.name.toLowerCase().includes(search.toLowerCase()) &&
    (filter === 'all' || prompt.downloads > 800)
  );

  return (
    <div className="shell">
      <aside className="side">
        <div className="brand">Packy Marketplace</div>

        <div className="muted" style={{ fontSize: 12, lineHeight: 1.5 }}>
          Discover and install community skills, MCPs, and prompts.
        </div>

        <div style={{ marginTop: 'auto' }} className="muted">
          <span className="pill">Community-driven</span>
        </div>
      </aside>

      <main className="main">
        <div className="top">
          <div>
            <div className="eyebrow">Marketplace</div>

            <h1 className="title">Explore community resources</h1>

            <p className="desc">
              Browse, search, and install skills, MCP servers, and prompt templates
              created by the Packy community.
            </p>
          </div>

          <span className="pill">BETA</span>
        </div>

        <section className="grid grid-2">
          <div className="card">
            <h2>Search & Filter</h2>

            <div className="field">
              <label className="label">SEARCH</label>
              <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name or description..."
              />
            </div>

            <div className="field">
              <label className="label">POPULARITY</label>
              <Select
                value={filter}
                onChange={e => setFilter(e.target.value)}
                options={[
                  { value: 'all', label: 'All' },
                  { value: 'popular', label: 'Popular (>1000 downloads)' },
                  { value: 'trending', label: 'Trending' },
                ]}
              />
            </div>

            <div className="field">
              <label className="label">RESOURCE TYPE</label>
              <div className="checks">
                <label className="check">
                  <input
                    type="radio"
                    name="resourceType"
                    checked={activeTab === 'skills'}
                    onChange={() => setActiveTab('skills')}
                  />
                  Skills
                </label>
                <label className="check">
                  <input
                    type="radio"
                    name="resourceType"
                    checked={activeTab === 'mcps'}
                    onChange={() => setActiveTab('mcps')}
                  />
                  MCP Servers
                </label>
                <label className="check">
                  <input
                    type="radio"
                    name="resourceType"
                    checked={activeTab === 'prompts'}
                    onChange={() => setActiveTab('prompts')}
                  />
                  Prompts
                </label>
              </div>
            </div>
          </div>

          <div className="card">
            <h2>{activeTab === 'skills' ? 'Skills' : activeTab === 'mcps' ? 'MCP Servers' : 'Prompts'}</h2>

            <div className="grid" style={{ gap: '1rem' }}>
              {activeTab === 'skills' ? (
                filteredSkills.map(skill => (
                  <div key={skill.id} className="card" style={{ boxShadow: 'var(--shadow-sm)', marginBottom: '1rem' }}>
                    <div className="card-body">
                      <h3>{skill.name}</h3>
                      <p className="text-muted mb-2">{skill.description}</p>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="text-sm text-muted">
                          By {skill.author} • {skill.downloads} downloads
                        </span>
                        <Button variant="outline" size="sm">
                          Install
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : activeTab === 'mcps' ? (
                filteredMcps.map(mcp => (
                  <div key={mcp.id} className="card" style={{ boxShadow: 'var(--shadow-sm)', marginBottom: '1rem' }}>
                    <div className="card-body">
                      <h3>{mcp.name}</h3>
                      <p className="text-muted mb-2">{mcp.description}</p>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="text-sm text-muted">
                          By {mcp.author} • {mcp.downloads} downloads
                        </span>
                        <Button variant="outline" size="sm">
                          Install
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                filteredPrompts.map(prompt => (
                  <div key={prompt.id} className="card" style={{ boxShadow: 'var(--shadow-sm)', marginBottom: '1rem' }}>
                    <div className="card-body">
                      <h3>{prompt.name}</h3>
                      <p className="text-muted mb-2">{prompt.description}</p>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="text-sm text-muted">
                          By {prompt.author} • {prompt.downloads} downloads
                        </span>
                        <Button variant="outline" size="sm">
                          Install
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {activeTab === 'skills' && filteredSkills.length === 0 ? (
              <p className="text-center text-muted py-4">No skills found matching your filters.</p>
            ) : activeTab === 'mcps' && filteredMcps.length === 0 ? (
              <p className="text-center text-muted py-4">No MCP servers found matching your filters.</p>
            ) : activeTab === 'prompts' && filteredPrompts.length === 0 ? (
              <p className="text-center text-muted py-4">No prompts found matching your filters.</p>
            ) : null}
          </div>
        </section>

        <div className="footerNote">
          Installing resources adds them to your local Packy configuration.
          Always review third-party code before installation.
        </div>
      </main>
    </div>
  );
}